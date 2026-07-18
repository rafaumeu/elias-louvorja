/**
 * LLM Providers config para LouvorJ.AI chatbot.
 *
 * Suporta:
 *  - Groq (default, gratuito, llama-3.3-70b)
 *  - Z.AI / GLM (glm-4.6, glm-4-flash)
 *  - OpenRouter (acesso a Claude, GPT, Gemini, etc.)
 *  - OpenAI (gpt-4o-mini)
 *
 * Usuario pode trazer a propria key (BYOK) — ver llm-keyvault.js.
 */

export const LLM_PROVIDERS = {
  groq: {
    id: "groq",
    name: "Groq (Free)",
    description: "Gratuito • Llama 3.3 70B • Rápido",
    apiUrl: "https://api.groq.com/openai/v1/chat/completions",
    devProxy: "/groq-api/openai/v1/chat/completions",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (recomendado)" },
      { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (mais rápido)" },
      { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" },
    ],
    keyPrefix: "gsk_",
    keyUrl: "https://console.groq.com/keys",
    keyHint: "Crie uma conta gratuita em console.groq.com",
    isDefault: true,
    // Em dev usa proxy Vite pra evitar CORS; em prod direto
    getEndpoint: (isDev) => (isDev ? this.devProxy : this.apiUrl),
  },
  zai: {
    id: "zai",
    name: "Z.AI (GLM)",
    description: "GLM 4.6 • Brasileiro-friendly • Multilingue",
    apiUrl: "https://api.z.ai/api/paas/v4/chat/completions",
    devProxy: "/zai-api/api/paas/v4/chat/completions",
    defaultModel: "glm-4.6",
    models: [
      { id: "glm-4.6", name: "GLM 4.6 (recomendado)" },
      { id: "glm-4-flash", name: "GLM 4 Flash (mais rápido)" },
      { id: "glm-4-air", name: "GLM 4 Air" },
    ],
    keyPrefix: "",
    keyUrl: "https://z.ai/manage-apikey/apikey-list",
    keyHint: "Crie uma key em z.ai/manage-apikey",
    getEndpoint: (isDev) => (isDev ? this.devProxy : this.apiUrl),
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    description: "Acesso a Claude, GPT, Gemini • Pago",
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    devProxy: "/openrouter-api/api/v1/chat/completions",
    defaultModel: "anthropic/claude-3.5-sonnet",
    models: [
      { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini (barato)" },
      { id: "google/gemini-flash-1.5", name: "Gemini 1.5 Flash" },
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
    ],
    keyPrefix: "sk-or-",
    keyUrl: "https://openrouter.ai/keys",
    keyHint: "Crie uma key em openrouter.ai/keys",
    getEndpoint: (isDev) => (isDev ? this.devProxy : this.apiUrl),
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o • Pago",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    devProxy: "/openai-api/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini (recomendado)" },
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    ],
    keyPrefix: "sk-",
    keyUrl: "https://platform.openai.com/api-keys",
    keyHint: "Crie uma key em platform.openai.com/api-keys",
    getEndpoint: (isDev) => (isDev ? this.devProxy : this.apiUrl),
  },
};

/**
 * Retorna a config do provider selecionado.
 * @param {string} providerId
 * @returns {object}
 */
export function getProvider(providerId) {
  return LLM_PROVIDERS[providerId] || LLM_PROVIDERS.groq;
}

/**
 * Lista providers disponíveis (para UI).
 */
export function listProviders() {
  return Object.values(LLM_PROVIDERS).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    isDefault: p.isDefault || false,
    models: p.models,
    keyUrl: p.keyUrl,
    keyHint: p.keyHint,
  }));
}
