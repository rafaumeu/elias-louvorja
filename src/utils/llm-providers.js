/**
 * LLM Providers config para LouvorJ.AI chatbot.
 *
 * Suporta (BYOK — Bring Your Own Key):
 *  - Groq (default, gratuito, llama-3.3-70b)
 *  - Z.AI / GLM (glm-4.6, glm-4-flash) — OpenAI-compatible
 *  - OpenRouter (acesso a Claude, GPT, Gemini, etc.) — OpenAI-compatible
 *  - OpenAI (gpt-4o-mini) — OpenAI-compatible nativo
 *  - Anthropic Claude — API própria (x-api-key, formato messages)
 *  - Google Gemini — API própria (?key=, formato generateContent)
 *  - NVIDIA Build — OpenAI-compatible
 *  - Ollama Cloud — OpenAI-compatible (self-hosted ou cloud)
 *
 * Usuario pode trazer a propria key — ver llm-keyvault.js.
 *
 * Format adapters em llm-adapters.js (gemini e anthropic usam formatos próprios).
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
    // OpenAI-compatible: usa fetch direto com Bearer
    format: "openai",
  },
  zai: {
    id: "zai",
    name: "Z.AI (GLM)",
    description: "GLM 4.6 • Multilíngue • OpenAI-compatible",
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
    format: "openai",
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
    format: "openai",
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
    format: "openai",
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Claude 3.5/3.7 Sonnet/Opus • API nativa",
    apiUrl: "https://api.anthropic.com/v1/messages",
    devProxy: "/anthropic-api/v1/messages",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (recomendado)" },
      { id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (rápido)" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
    ],
    keyPrefix: "sk-ant-",
    keyUrl: "https://console.anthropic.com/settings/keys",
    keyHint: "Crie uma key em console.anthropic.com/settings/keys",
    format: "anthropic",
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    description: "Gemini 1.5/2.0 Flash/Pro • Free tier generoso",
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    devProxy: "/gemini-api/v1beta/models",
    defaultModel: "gemini-1.5-flash",
    models: [
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (recomendado)" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
      { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (experimental)" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
    ],
    keyPrefix: "AIza",
    keyUrl: "https://aistudio.google.com/app/apikey",
    keyHint: "Crie uma key em aistudio.google.com/app/apikey (free tier)",
    format: "gemini",
  },
  nvidia: {
    id: "nvidia",
    name: "NVIDIA Build",
    description: "NIM API • Llama, Mistral, Qwen • Free credits",
    apiUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
    devProxy: "/nvidia-api/v1/chat/completions",
    defaultModel: "meta/llama-3.1-70b-instruct",
    models: [
      { id: "meta/llama-3.1-70b-instruct", name: "Llama 3.1 70B (recomendado)" },
      { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B (pesado)" },
      { id: "mistralai/mixtral-8x22b-instruct-v0.1", name: "Mixtral 8x22B" },
      { id: "qwen/qwen2.5-7b-instruct", name: "Qwen 2.5 7B (rápido)" },
      { id: "deepseek-ai/deepseek-r1", name: "DeepSeek R1 (raciocínio)" },
    ],
    keyPrefix: "nvapi-",
    keyUrl: "https://build.nvidia.com/profile",
    keyHint: "Crie uma key em build.nvidia.com (1000 credits free)",
    format: "openai",
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Self-hosted)",
    description: "Self-hosted (localhost:11434) • OpenAI-compatible • Grátis",
    // Default: self-hosted local. Usuário pode trocar URL se usar servidor remoto.
    apiUrl: "http://localhost:11434/v1/chat/completions",
    devProxy: "/ollama-api/v1/chat/completions",
    defaultModel: "llama3.1",
    models: [
      { id: "llama3.1", name: "Llama 3.1 (default)" },
      { id: "qwen2.5", name: "Qwen 2.5" },
      { id: "mistral", name: "Mistral" },
      { id: "phi3", name: "Phi 3 (leve)" },
    ],
    keyPrefix: "",
    keyUrl: "https://ollama.com/download",
    keyHint: "Self-hosted: rode 'ollama serve' localmente. URL padrão: http://localhost:11434",
    format: "openai",
    // Campo extra: usuário pode customizar URL (self-hosted remoto)
    customUrl: true,
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
    format: p.format,
    keyPrefix: p.keyPrefix,
    customUrl: p.customUrl || false,
  }));
}
