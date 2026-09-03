import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configuration conditionnelle de Cloudinary
const isConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}

/**
 * Téléverse un buffer d'image directement vers Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "terranova_agro",
  publicId?: string
): Promise<{ url: string; publicId: string; format: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary n'est pas configuré. Veuillez définir CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET."
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "auto",
        overwrite: true,
        transformation: [
          { quality: "auto:good", fetch_format: "auto" },
        ],
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(error || new Error("Erreur inconnue lors de l'upload Cloudinary"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Supprime une ressource Cloudinary via son public_id ou son URL
 */
export async function deleteFromCloudinary(urlOrPublicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;

  try {
    let publicId = urlOrPublicId;
    if (urlOrPublicId.startsWith("http")) {
      // Extraire le public_id de l'URL Cloudinary
      // Ex: https://res.cloudinary.com/demo/image/upload/v12345/terranova_agro/product1.jpg -> terranova_agro/product1
      const matches = urlOrPublicId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      if (matches && matches[1]) {
        publicId = matches[1];
      }
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("[CLOUDINARY DELETE ERROR]", error);
    return false;
  }
}
