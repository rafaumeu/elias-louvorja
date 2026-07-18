import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    base: process.env.VITE_BASE_URL ?? "/",
    plugins: [
      vue(),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
      }),
      VitePWA({
        registerType: "autoUpdate", // Registra o Service Worker para atualizar automaticamente
        // Força o novo SW a assumir imediatamente, sem esperar todas as tabs fecharem.
        // Evita o bug "usuário roda código antigo do cache PWA após deploy".
        strategies: "generateSW",
        skipWaiting: true,
        clientsClaim: true,
        devOptions: {
          enabled: true, // Ativa o PWA também durante o desenvolvimento
        },
        workbox: {
          globPatterns: ["**/*.{html,js,css,svg,png}"], // Arquivos que o Service Worker deve cachear
        },
        manifest: {
          name: "LouvorJA",
          short_name: "LouvorJA",
          description: "Software de músicas para Louvor e Adoração",
          start_url: process.env.VITE_BASE_URL ?? "/",
          display: "standalone",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            {
              src: (process.env.VITE_BASE_URL ?? "/") + "ico/favicon-16x16.png",
              sizes: "16x16",
              type: "image/png",
            },
            {
              src: (process.env.VITE_BASE_URL ?? "/") + "ico/favicon-32x32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src:
                (process.env.VITE_BASE_URL ?? "/") + "ico/favicon-144x144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src:
                (process.env.VITE_BASE_URL ?? "/") + "ico/favicon-152x152.png",
              sizes: "152x152",
              type: "image/png",
            },
            {
              src:
                (process.env.VITE_BASE_URL ?? "/") + "ico/favicon-180x180.png",
              sizes: "180x180",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    define: {
      "process.env": {},
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5002,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy: {
        "/groq-api": {
          target: "https://api.groq.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/groq-api/, ""),
        },
        "/zai-api": {
          target: "https://api.z.ai",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/zai-api/, ""),
        },
        "/openrouter-api": {
          target: "https://openrouter.ai",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/openrouter-api/, ""),
        },
        "/openai-api": {
          target: "https://api.openai.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/openai-api/, ""),
        },
        "/anthropic-api": {
          target: "https://api.anthropic.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/anthropic-api/, ""),
        },
        "/gemini-api": {
          target: "https://generativelanguage.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/gemini-api/, ""),
        },
        "/nvidia-api": {
          target: "https://integrate.api.nvidia.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/nvidia-api/, ""),
        },
        "/ollama-api": {
          target: "https://cloud.olama.ai",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ollama-api/, ""),
        },
      },
    },
    /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
  });
};
