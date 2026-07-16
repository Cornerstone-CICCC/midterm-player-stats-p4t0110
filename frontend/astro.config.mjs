import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    define: {
      'import.meta.env.API_URL': JSON.stringify('http://localhost:3001/api')
    }
  }
});
