// Usage: pnpm hash-password
// Prints values for ADMIN_PASSWORD_HASH and ADMIN_JWT_SECRET.
import { randomBytes, webcrypto } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const rl = createInterface({ input: stdin, output: stdout });
const pw = (await rl.question("Admin password thar: ")).trim();
rl.close();
if (pw.length < 8) {
  console.error("Password hi character 8 aia tam tur a ni.");
  process.exit(1);
}

const iterations = 50000;
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const key = await webcrypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
const bits = new Uint8Array(
  await webcrypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256),
);
const hash = `pbkdf2:${iterations}:${Buffer.from(salt).toString("base64")}:${Buffer.from(bits).toString("base64")}`;

console.log("\nADMIN_PASSWORD_HASH=" + hash);
console.log("ADMIN_JWT_SECRET=" + randomBytes(32).toString("hex"));
console.log("\nHeng line 2 hi .env.local leh Cloudflare (Variables and Secrets) ah dah rawh.");
