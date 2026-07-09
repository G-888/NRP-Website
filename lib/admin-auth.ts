import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "nrp_admin_session";
const maxAgeSeconds = 60 * 60 * 12;

function getPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || getPassword();
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !safeEqual(signature, sign(issuedAt))) return false;

  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age <= maxAgeSeconds * 1000;
}

export function verifyAdminPassword(password: string) {
  return safeEqual(password, getPassword());
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(cookieName)?.value);
}

export function getAdminCookieName() {
  return cookieName;
}

export function getAdminCookieMaxAge() {
  return maxAgeSeconds;
}
