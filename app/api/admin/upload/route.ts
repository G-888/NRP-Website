import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");
  const name = formData.get("name");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File diperlukan." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Hanya JPG, PNG, WEBP atau PDF dibenarkan." }, { status: 400 });
  }

  const safeFolder = folder === "certificates" ? "certificates" : "images";
  const extension = path.extname(file.name).toLowerCase() || (file.type === "application/pdf" ? ".pdf" : ".jpg");
  const baseName = slugify(typeof name === "string" && name ? name : path.basename(file.name, extension));
  const fileName = `${baseName}-${Date.now()}${extension}`;
  const targetDir = path.join(process.cwd(), "public", safeFolder);
  const targetPath = path.join(targetDir, fileName);

  await fs.mkdir(targetDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(targetPath, buffer);

  return NextResponse.json({
    ok: true,
    href: `/${safeFolder}/${fileName}`,
    type: file.type === "application/pdf" ? "pdf" : "image"
  });
}
