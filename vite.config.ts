import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const customPlugin: Plugin = {
  name: "custom-plugin",
  resolveId(source) {
    if (source === "some-module") {
      return { id: source, moduleSideEffects: false };
    }
    return null;
  },
  load(id) {
    if (id === "some-module") {
      return "export default {}";
    }
    return null;
  },
  transform(code) {
    return { code };
  },
};

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    customPlugin,
    nodePolyfills({
      include: ["buffer", "process"], // only polyfill what you use
      protocolImports: true,
    }),
    {
      // 🔑 inject Buffer globally at runtime
      name: "buffer-shim",
      enforce: "post",
      transformIndexHtml(html) {
        return html.replace(
          "</head>",
          `<script type="module">
             import { Buffer } from 'buffer';
             window.Buffer = Buffer;
           </script></head>`
        );
      },
    },
  ],
  base: "/",
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
