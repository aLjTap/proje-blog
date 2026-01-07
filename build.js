#!/usr/bin/env bun

// This script prepares the project for Cloudflare Pages deployment

import { existsSync } from 'node:fs';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

console.log('🔨 Building for Cloudflare Pages...');

const cwd = process.cwd();
const publicDir = path.join(cwd, 'public');

// Create public directory if needed
if (!existsSync(publicDir)) {
  await mkdir(publicDir, { recursive: true });
}

// Copy static files
const copyStaticFiles = async (src, dest) => {
  const srcPath = path.join(cwd, src);
  const destPath = path.join(cwd, dest);

  if (!existsSync(srcPath)) return;

  try {
    await mkdir(destPath, { recursive: true });
    await cp(srcPath, destPath, { recursive: true, force: true });
  } catch {
    // ignore errors
  }
};

await copyStaticFiles('css', 'public/css');
await copyStaticFiles('data', 'public/data');

console.log('✅ Build complete!');
