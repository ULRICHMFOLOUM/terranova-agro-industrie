import fs from "fs";
import path from "path";
import zlib from "zlib";

function createSolidPNG(width, height, r, g, b, a = 255) {
  // Construct a minimal uncompressed/deflated raw PNG image
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    // Calculate simple CRC32
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      let byte = buf[i];
      crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // Precompute CRC table
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  const ihdrChunk = makeChunk("IHDR", ihdr);

  // Raw bitmap scanlines
  const rowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rowLen * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLen;
    rawData[rowOffset] = 0; // filter type 0: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      // Draw warm gold monogram in center, dark green background
      const distFromCenter = Math.hypot(x - width / 2, y - height / 2);
      if (distFromCenter < width * 0.35 && distFromCenter > width * 0.32) {
        // Gold ring
        rawData[pxOffset] = 230; // R
        rawData[pxOffset + 1] = 175; // G
        rawData[pxOffset + 2] = 46; // B
        rawData[pxOffset + 3] = 255;
      } else if (distFromCenter < width * 0.15) {
        // Terracotta seed
        rawData[pxOffset] = 194;
        rawData[pxOffset + 1] = 101;
        rawData[pxOffset + 2] = 38;
        rawData[pxOffset + 3] = 255;
      } else {
        // Base dark clay background
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
        rawData[pxOffset + 3] = a;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk("IDAT", compressedData);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const png192 = createSolidPNG(192, 192, 30, 40, 31);
const png512 = createSolidPNG(512, 512, 30, 40, 31);

fs.writeFileSync(path.join(process.cwd(), "public", "icon-192.png"), png192);
fs.writeFileSync(path.join(process.cwd(), "public", "icon-512.png"), png512);
fs.writeFileSync(path.join(process.cwd(), "public", "icon-maskable-512.png"), png512);
fs.writeFileSync(path.join(process.cwd(), "public", "favicon.ico"), png192);

console.log("✅ PWA PNG & ICO files generated with valid RGBA buffers.");
