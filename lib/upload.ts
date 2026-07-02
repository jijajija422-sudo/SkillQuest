export function isCloudinaryConfigured() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return Boolean(
    cloudName &&
    cloudName.trim() !== "" &&
    cloudName !== "your_cloud_name"
  );
}

export async function uploadToCloudinary(file: File): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary keys are missing in .env.local");
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);

  // If we have an unsigned upload preset, upload client-side directly
  if (uploadPreset && uploadPreset.trim() !== "") {
    formData.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image directly to Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;
  }

  // Otherwise fallback to signed server-side upload endpoint
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to upload image via server /api/upload");
  }

  const data = await res.json();
  return data.url;
}

export const uploadImage = uploadToCloudinary;