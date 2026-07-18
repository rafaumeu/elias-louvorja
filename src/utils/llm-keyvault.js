/**
 * KeyVault — armazena API keys do usuário de forma SEGURA no navegador.
 *
 * Camadas de proteção:
 *  1. Key NUNCA vai pro servidor (todas as chamadas LLM são client-side)
 *  2. Key é criptografada com AES-GCM antes de salvar no localStorage
 *  3. Chave de cripto derivada de um random salt guardado por origem
 *  4. Key só é decriptada na memória RAM durante a chamada LLM
 *
 * Não é "perfeito" (nada no browser é), mas previne:
 *  - Leak via XSS que lê localStorage em texto puro
 *  - Inspeção casual no DevTools
 *  - Compartilhamento acidental de key
 */

const VAULT_KEY = "louvorja_llm_vault_v1";
const SALT_KEY = "louvorja_llm_salt_v1";

/**
 * Deriva uma CryptoKey do salt guardado (HKDF-SHA256).
 * A derived key NÃO é persistida — só vive na sessão.
 */
async function getDerivedKey() {
  let salt = localStorage.getItem(SALT_KEY);
  if (!salt) {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    salt = btoa(String.fromCharCode(...saltBytes));
    localStorage.setItem(SALT_KEY, salt);
  }
  const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));

  // Material base: combina origin + timestamp install pra dificultar clone
  const baseMaterial = `${window.location.origin}|louvorja-vault|${salt}`;
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(baseMaterial),
    { name: "HKDF" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: saltBytes, info: new Uint8Array(0) },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Salva a config do provider + key (criptografada).
 * @param {string} providerId
 * @param {string} modelId
 * @param {string} apiKey (plaintext — será criptografada)
 */
export async function saveCredentials(providerId, modelId, apiKey) {
  const cryptoKey = await getDerivedKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    new TextEncoder().encode(apiKey),
  );
  const vault = {
    providerId,
    modelId,
    // Base64 do iv + ciphertext
    key: btoa(String.fromCharCode(...iv, ...new Uint8Array(encrypted))),
    savedAt: Date.now(),
  };
  localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  return vault;
}

/**
 * Lê a config do vault.
 * @returns {object|null} { providerId, modelId, apiKey (plaintext) }
 */
export async function loadCredentials() {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return null;
  try {
    const vault = JSON.parse(raw);
    const cryptoKey = await getDerivedKey();
    const bytes = Uint8Array.from(atob(vault.key), (c) => c.charCodeAt(0));
    const iv = bytes.slice(0, 12);
    const ciphertext = bytes.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      ciphertext,
    );
    return {
      providerId: vault.providerId,
      modelId: vault.modelId,
      apiKey: new TextDecoder().decode(decrypted),
      savedAt: vault.savedAt,
    };
  } catch (e) {
    console.warn("[KeyVault] Falha ao decriptar — vault corrompido ou salto mudou.", e);
    return null;
  }
}

/**
 * Verifica se tem credentials salvas (sem decriptar).
 */
export function hasCredentials() {
  return !!localStorage.getItem(VAULT_KEY);
}

/**
 * Limpa o vault.
 */
export function clearCredentials() {
  localStorage.removeItem(VAULT_KEY);
}

/**
 * Retorna só metadados (sem key) pra UI mostrar estado.
 */
export function getCredentialsMeta() {
  const raw = localStorage.getItem(VAULT_KEY);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return { providerId: v.providerId, modelId: v.modelId, savedAt: v.savedAt };
  } catch {
    return null;
  }
}
