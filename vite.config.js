import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/google-tts' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              req.body = JSON.parse(body);
              const { ttsHandler } = await import('./api/google-tts.js');
              ttsHandler(req, res);
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
