// Load HTML page and posts data
const indexPage = await Bun.file("./pages/index.html").text();
const postsData = await Bun.file("./data/posts.json").json();

// Serve static files middleware
async function serveStatic(path: string) {
  const file = Bun.file(`.${path}`);
  if (await file.exists()) {
    const extension = path.split('.').pop() || '';
    const mimeTypes: { [key: string]: string } = {
      'css': 'text/css',
      'js': 'application/javascript',
      'html': 'text/html',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
    };

    const contentType = mimeTypes[extension] || 'application/octet-stream';
    return new Response(file, {
      headers: { 'Content-Type': contentType },
    });
  }
  return null;
}

Bun.serve({
  port: 3001,
  development: true,

  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Log incoming requests
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

    // Static files (CSS, JS, etc.)
    if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/public/')) {
      const staticFile = await serveStatic(pathname);
      if (staticFile) return staticFile;
    }

    // API endpoint for posts
    if (pathname === '/api/posts') {
      return new Response(JSON.stringify(postsData), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Single post by slug
    if (pathname.startsWith('/api/posts/')) {
      const slug = pathname.replace('/api/posts/', '');
      const posts = postsData.posts || [];
      const post = posts.find((p: any) => p.slug === slug);

      if (post) {
        return new Response(JSON.stringify(post), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify({ error: 'Post not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // SPA: Serve index.html for all routes (client-side routing)
    if (pathname === '/' || pathname === '/about' || pathname.startsWith('/post/')) {
      return new Response(indexPage, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // 404 Not Found
    return new Response(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>404 - Sayfa Bulunamadı</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; }
    h1 { font-size: 2rem; }
  </style>
</head>
<body>
  <h1>404 - Sayfa Bulunamadı</h1>
  <p>Aradığınız sayfa bulunamadı.</p>
  <a href="/">Ana Sayfaya Dön</a>
</body>
</html>`,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 404,
      }
    );
  },

  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.log('🚀 Blog server running at http://localhost:3001');