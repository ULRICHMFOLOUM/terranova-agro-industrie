import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    await requireAuth("ADMIN");

    const formData = await req.formData();
    let files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      files = formData.getAll("file") as File[];
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    const cloudinaryActive = isCloudinaryConfigured();

    // Répertoire local de secours si Cloudinary n'est pas encore configuré
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!cloudinaryActive && !fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      if (!file || typeof file.arrayBuffer !== "function") continue;

      // Limite 15 Mo
      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Le fichier ${file.name} dépasse la taille maximale autorisée (15 Mo).` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (cloudinaryActive) {
        // Mode Production Cloudinary : stockage persistant dans le cloud
        const result = await uploadToCloudinary(buffer, "terranova_agro");
        uploadedUrls.push(result.url);
      } else {
        // Mode Développement local de secours
        const safeName = file.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "_");
        const timestamp = Date.now();
        const uniqueName = `${timestamp}-${safeName}`;
        const filePath = path.join(uploadsDir, uniqueName);

        fs.writeFileSync(filePath, buffer);
        uploadedUrls.push(`/uploads/${uniqueName}`);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: "Aucun fichier valide n'a pu être téléversé." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
      provider: cloudinaryActive ? "cloudinary" : "local",
    });
  } catch (error: any) {
    console.error("[UPLOAD API ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors du téléversement des images." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json({ error: "URL de fichier manquante." }, { status: 400 });
    }

    // Suppression Cloudinary
    if (fileUrl.includes("cloudinary.com") || fileUrl.startsWith("http")) {
      await deleteFromCloudinary(fileUrl);
      return NextResponse.json({ success: true, provider: "cloudinary" });
    }

    // Suppression Locale
    if (fileUrl.startsWith("/uploads/")) {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return NextResponse.json({ success: true, provider: "local" });
    }

    return NextResponse.json({ error: "Format d'URL de fichier non reconnu." }, { status: 400 });
  } catch (error: any) {
    console.error("[UPLOAD DELETE ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
