import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), 
        //mkcert(), 
        VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
            enabled: true,
        }, 
        manifest: {
            "name": "Vostochniy Launches",
            "short_name": "Launches",
            "start_url": "/launches-planner-frontend/",
            "display": "standalone",
            "background_color": "#fdfdfd",
            "theme_color": "#2050a0",
            "orientation": "portrait-primary",
            "icons": [
                {
                    "src": "/launches-planner-frontend/logo192.png",
                    "type": "image/png", "sizes": "192x192"
                },
                {
                    "src": "/launches-planner-frontend/logo512.png",
                    "type": "image/png", "sizes": "512x512"
                }
            ]
        }
    })],
    base: '/launches-planner-frontend',
    server: {
        port: 5000,
        proxy: {
            "/api": {
                target: "http://localhost:8000", // URL вашего Django-сервера
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        // https: {
        //     key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
        //     cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
        // },
    },
});