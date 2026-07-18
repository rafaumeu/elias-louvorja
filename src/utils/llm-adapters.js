/**
 * LLM Format Adapters.
 *
 * Nem todo provider fala "OpenAI-compatible". Gemini e Anthropic têm
 * schemas próprios. Este módulo converte um request "canônico" (OpenAI shape)
 * para o formato de cada provider e parseia a resposta de volta.
 *
 * Canônico (input):
 *   { system, messages: [{role, content}], model, maxTokens, temperature }
 *
 * Output (sempre igual):
 *   { text: string }
 */

/**
 * Gemini: POST {apiUrl}/{model}:generateContent?key={apiKey}
 * Body: { contents: [{ role, parts: [{text}] }], systemInstruction, generationConfig }
 * Response: { candidates: [{ content: { parts: [{text}] } }] }
 */
export async function callGemini({ apiUrl, apiKey, model, system, messages, maxTokens, temperature }) {
  // Gemini roles: "user" e "model" (não "assistant")
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `${apiUrl}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errBody.substring(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  const blockedReason = data?.promptFeedback?.blockReason;
  if (!text && blockedReason) {
    throw new Error(`Gemini bloqueou: ${blockedReason}`);
  }
  return { text };
}

/**
 * Anthropic: POST {apiUrl}
 * Headers: x-api-key, anthropic-version
 * Body: { model, system, messages, max_tokens, temperature }
 * Response: { content: [{ type: "text", text }] }
 */
export async function callAnthropic({ apiUrl, apiKey, model, system, messages, maxTokens, temperature }) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Permite chamada direta do browser (CORS). docs.anthropic.com.
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      ...(system ? { system } : {}),
      messages: messages.map((m) => ({
        role: m.role, // "user" ou "assistant" — igual ao nosso
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errBody.substring(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.content?.map((c) => c.text || "").join("") || "";
  return { text };
}

/**
 * OpenAI-compatible: Groq, Z.AI, OpenRouter, OpenAI, NVIDIA, Ollama.
 * POST {apiUrl}, headers: Authorization Bearer
 */
export async function callOpenAICompat({ apiUrl, apiKey, model, system, messages, maxTokens, temperature, extraHeaders = {} }) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`LLM API ${res.status}: ${errBody.substring(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return { text };
}
