import { serve } from 'bun';
import index from './index.html';

// Minimal static server: serve the app's index.html for any unmatched route.
// This avoids executing browser-only client code (e.g. `document`) on the
// Bun server. No API endpoints are exposed here.
const server = serve({
  routes: {
    '/*': index,
  },
  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
