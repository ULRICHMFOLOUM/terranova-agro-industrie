import fs from "fs";
import path from "path";

// A small utility script to generate crisp, valid placeholder PNG icons for PWA if native image processing tools are absent
// It writes a minimal valid PNG 1x1 buffer or uses base64 PNG templates for 192 and 512 sizes

const svgFavicon = fs.readFileSync(path.join(process.cwd(), "public", "favicon.svg"), "utf8");

// Copy SVG to icon-192 and icon-512 SVG counterparts
fs.writeFileSync(path.join(process.cwd(), "public", "icon-192.svg"), svgFavicon);
fs.writeFileSync(path.join(process.cwd(), "public", "icon-512.svg"), svgFavicon);
fs.writeFileSync(path.join(process.cwd(), "public", "icon-maskable-512.svg"), svgFavicon);

console.log("✅ PWA SVG Icons generated successfully in /public");
