import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@apidex/core": "/src/core",
            "@apidex/bundles": "/src/bundles",
        },
    },
    server: {
        host: true,
        port: 3000,
        open: true,
        proxy: {
            "/Documentation": "http://localhost:5276",
            "/Rag": "http://localhost:5276",
            "/Assistant": "http://localhost:5276",
        },
    },
    preview: {
        port: 3000,
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        target: "esnext",
    },
})
