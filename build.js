#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const BUILD_DIR = "build";
const PAGES_DIR = "pages";
const CSS_DIR = "css";

async function build() {
  try {
    console.log("🏗️  Building project...\n");

    // Clean build directory
    if (existsSync(BUILD_DIR)) {
      console.log(`🗑️  Cleaning ${BUILD_DIR}/...`);
      await rm(BUILD_DIR, { recursive: true, force: true });
    }

    // Create build directory
    await mkdir(BUILD_DIR, { recursive: true });
    console.log(`📁 Created ${BUILD_DIR}/ directory\n`);

    // Copy HTML file
    console.log("📄 Copying HTML...");
    const htmlSource = join(PAGES_DIR, "index.html");
    const htmlDest = join(BUILD_DIR, "index.html");
    await copyFile(htmlSource, htmlDest);
    console.log(`   ✓ ${htmlSource} → ${htmlDest}`);

    // Copy CSS files
    console.log("\n🎨 Copying CSS files...");
    const cssFiles = await readdir(CSS_DIR);
    for (const file of cssFiles) {
      if (file.endsWith(".css")) {
        const source = join(CSS_DIR, file);
        const dest = join(BUILD_DIR, file);
        await copyFile(source, dest);
        console.log(`   ✓ ${source} → ${dest}`);
      }
    }

    console.log("\n✅ Build complete!");
    console.log(`\n📦 Output directory: ./${BUILD_DIR}/`);
    console.log("\n🚀 Ready to deploy!");
    console.log(`\n📋 Files in ${BUILD_DIR}:`);

    const builtFiles = await readdir(BUILD_DIR);
    for (const file of builtFiles) {
      console.log(`   • ${file}`);
    }

  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
