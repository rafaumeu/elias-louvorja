/**
 * LLM Credentials Vault (Multi-provider).
 *
 * Cada provider (Groq, Z.AI, OpenRouter, OpenAI, Anthropic, Gemini,
 * NVIDIA, Ollama) tem seu próprio slot de credenciais. Permite ao
 * usuario alternar entre providers sem re-digitar a key.
 *
 * Criptografia: WebCrypto AES-GCM com chave derivada por PBKDF2
 * a partir de um salt aleatorio + fingerprint do browser. Nao e
 * "forte" contra atacante com acesso ao localStorage, mas protege
 * contra leakage casual (logs, screenshots, devtools aberto).
 *
 * Storage format (VAULT_KEY):
 *   { [providerId]: { iv, ct, salt, modelId, savedAt } | null }
 */
const VAULT_KEY = "louvorja_llm_vault_v2";
const OLD_VAULT_KEY = "louvorja_llm_vault"; // migracao automatica

/* ------------------------------- helpers ------------------------------- */

function getFingerprint() {
  const n = navigator;
  const fp = [
    n.userAgent,
    n.language,
    n.hardwareConcurrency || 0,
    (n.languages || []).join(","),
    String(screen.width || 0),
    String(screen.height || 0),
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  ].join("|");
  // SHA-256 -> hex (deterministic, mesma key em mesmo browser)
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(fp))
    .then((buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join(""));
}

async function getDerivedKey(salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(await getFingerprint()),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptValue(plaintext, salt) {
  const cryptoKey = await getDerivedKey(salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    new TextEncoder().encode(plaintext),
  );
  return {
    iv: btoa(String.fromCharCode(...iv)),
    ct: btoa(String.fromCharCode(...new Uint8Array(ct))),
  };
}

async function decryptValue(payload, salt) {
  const cryptoKey = await getDerivedKey(salt);
  const iv = new Uint8Array(Array.from(atob(payload.iv), (c) => c.charCodeAt(0)));
  const ct = new Uint8Array(Array.from(atob(payload.ct), (c) => c.charCodeAt(0)));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, ct);
  return new TextDecoder().decode(pt);
}

/* ----------------------------- vault read/write ----------------------------- */

function readVault() {
  let raw = localStorage.getItem(VAULT_KEY);
  if (!raw) {
    // Migracao automatica do formato antigo (single-credential)
    const old = localStorage.getItem(OLD_VAULT_KEY);
    if (old) {
      try {
        const parsed = JSON.parse(old);
        if (parsed && parsed.providerId) {
          const migrated = {
            [parsed.providerId]: {
              iv: parsed.iv,
              ct: parsed.ct,
              salt: parsed.salt,
              modelId: parsed.modelId,
              savedAt: parsed.savedAt || Date.now(),
            },
          };
          localStorage.setItem(VAULT_KEY, JSON.stringify(migrated));
          localStorage.removeItem(OLD_VAULT_KEY);
          return migrated;
        }
      } catch { /* ignore broken old vault */ }
    }
    return {};
  }
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function writeVault(vault) {
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
}

/* ------------------------------- public API ------------------------------- */

/**
 * Salva (ou sobrescreve) credenciais para um provider.
 * @param {string} providerId
 * @param {string} modelId
 * @param {string} apiKey (plaintext — sera criptografada)
 */
export async function saveCredentials(providerId, modelId, apiKey) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = await encryptValue(apiKey, Array.from(salt));
  const vault = readVault();
  vault[providerId] = {
    iv: enc.iv,
    ct: enc.ct,
    salt: Array.from(salt),
    modelId,
    savedAt: Date.now(),
  };
  writeVault(vault);
}

/**
 * Le credenciais de um provider especifico (decriptada).
 * @param {string} providerId
 * @returns {Promise<object|null>} { providerId, modelId, apiKey }
 */
export async function loadCredentials(providerId) {
  const vault = readVault();
  const slot = vault[providerId];
  if (!slot) return null;
  try {
    const apiKey = await decryptValue(slot, new Uint8Array(slot.salt));
    return { providerId, modelId: slot.modelId, apiKey };
  } catch {
    return null;
  }
}

/**
 * Le credenciais do provider atualmente ativo.
 * Compatibilidade: se nao passar providerId, pega o primeiro slot disponivel.
 */
export async function loadAnyCredentials() {
  const vault = readVault();
  const ids = Object.keys(vault);
  if (ids.length === 0) return null;
  return loadCredentials(ids[0]);
}

/**
 * Lista metadados de TODAS as credenciais salvas (sem decriptar).
 * Para o UI mostrar "chaves salvas neste navegador".
 * @returns {Array<{providerId, modelId, savedAt}>}
 */
export function listCredentialsMeta() {
  const vault = readVault();
  return Object.entries(vault).map(([providerId, slot]) => ({
    providerId,
    modelId: slot.modelId,
    savedAt: slot.savedAt,
  }));
}

/**
 * Verifica se um provider especifico tem credencial salva.
 */
export function hasCredentials(providerId) {
  const vault = readVault();
  return providerId ? !!vault[providerId] : Object.keys(vault).length > 0;
}

/**
 * Remove credencial de UM provider.
 */
export function clearCredentials(providerId) {
  const vault = readVault();
  if (providerId) {
    delete vault[providerId];
    writeVault(vault);
  } else {
    // Limpa tudo (legacy: sem arg = limpa tudo)
    localStorage.removeItem(VAULT_KEY);
  }
}
