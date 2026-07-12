import { v2 as cloudinary } from "cloudinary";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("ERROR: Cloudinary env vars not set");
  process.exit(1);
}

const pdfPath = resolve(__dirname, "..", "public", "logo.pdf");
const pdfBuffer = readFileSync(pdfPath);

console.log(`Uploading ${pdfPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)...`);

const result = await cloudinary.uploader.upload(
  `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
  {
    public_id: "poprika-logo",
    folder: "poprika",
    format: "png",
    overwrite: true,
    invalidate: true,
  }
);

console.log(`\n✅ Uploaded!`);
console.log(`Public ID:  ${result.public_id}`);
console.log(`URL:        ${result.secure_url}`);
console.log(`Width:      ${result.width}`);
console.log(`Height:     ${result.height}`);
console.log(`Format:     ${result.format}`);

console.log(`\nUse this URL in Header.tsx, Footer.tsx, and AdminSidebar.tsx:`);
console.log(result.secure_url);
