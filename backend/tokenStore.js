import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE = path.join(__dirname, "token.json");

export function save(tokens) {
  fs.writeFileSync(STORE, JSON.stringify(tokens, null, 2));
}

export function load() {
  if (fs.existsSync(STORE)) return JSON.parse(fs.readFileSync(STORE));
  return null;
}

export function clear() {
  if (fs.existsSync(STORE)) fs.unlinkSync(STORE);
}