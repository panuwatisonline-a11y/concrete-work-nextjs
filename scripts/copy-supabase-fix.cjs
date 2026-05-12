/**
 * Copy Supabase env-safety fixes into another clone of this repo.
 * Usage (from project root):
 *   node scripts/copy-supabase-fix.cjs "C:\path\to\other\concrete-work-nextjs"
 */
const fs = require("fs");
const path = require("path");

const destRoot = process.argv[2];
const root = path.join(__dirname, "..");

const files = [
  "src/lib/supabase/readonly.ts",
  "src/lib/supabase/server.ts",
  "src/lib/supabase/client.ts",
  "src/lib/supabase/queries.ts",
  "src/app/layout.tsx",
  "src/app/requests/page.tsx",
  "src/components/SupabaseEnvBanner.tsx",
  ".env.example",
  ".gitignore",
];

if (!destRoot || destRoot === "-h" || destRoot === "--help") {
  console.error('Usage: node scripts/copy-supabase-fix.cjs "<absolute-path-to-other-clone>"');
  process.exit(1);
}

const resolved = path.resolve(destRoot);
if (!fs.existsSync(resolved)) {
  console.error("Destination does not exist:", resolved);
  process.exit(1);
}

for (const rel of files) {
  const from = path.join(root, rel);
  const to = path.join(resolved, rel);
  if (!fs.existsSync(from)) {
    console.error("Missing source file:", from);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log("OK", rel);
}

const envLocal = path.join(resolved, ".env.local");
const envExample = path.join(resolved, ".env.example");
if (!fs.existsSync(envLocal) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envLocal);
  console.log("OK .env.local (copied from .env.example — replace placeholders with your Supabase API keys)");
} else if (fs.existsSync(envLocal)) {
  console.log("Skip .env.local (already exists)");
} else {
  console.log("Skip .env.local (.env.example missing at destination)");
}

console.log("\nDone. In the other clone run: npm run dev");
