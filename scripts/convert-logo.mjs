import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const pdfPath = resolve('public/logo.pdf');
const pngPath = resolve('public/logo.png');

const pdfData = new Uint8Array(readFileSync(pdfPath));
const doc = await pdfjs.getDocument({ data: pdfData }).promise;
const page = await doc.getPage(1);

const viewport = page.getViewport({ scale: 3 });
const canvas = createCanvas(viewport.width, viewport.height);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, viewport.width, viewport.height);
await page.render({ canvasContext: ctx, viewport }).promise;

const buffer = canvas.toBuffer('image/png');
writeFileSync(pngPath, buffer);

console.log(`Converted: ${pngPath} (${buffer.length} bytes, ${viewport.width}x${viewport.height})`);
