# proje-blog

A minimalist blog built with Bun and deployed on Cloudflare Pages.

## Install dependencies

```bash
bun install
```

## Development

```bash
bun run dev
```

Server will run at `http://localhost:3001`

## Build

```bash
bun run build
```

## Deployment to Cloudflare Pages

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Select "Pages" → "Create a project" → "Connect to Git"
4. Select your repository
5. Set build settings:
   - **Build command**: `bun run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
6. Click "Save and Deploy"

### Environment Setup

For Cloudflare Workers/Pages to properly serve the Bun app:
- Make sure `index.ts` is the entry point
- The `wrangler.toml` configuration handles routing
- Static files (CSS, JS, etc.) are served from the `dist` directory

This project uses [Bun](https://bun.com) - a fast all-in-one JavaScript runtime.
