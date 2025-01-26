import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function imageUrlToBase64(url: string) {
  try {
    // Fetch the image as a blob
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();

    // Create a FileReader to read the blob
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // Resolve with the Base64 string
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Failed to convert image to Base64"));
      };
      // Read the blob as a data URL
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image URL to Base64:", error);
    throw error;
  }
}

export const cloudinaryUrl =
  "https://api.cloudinary.com/v1_1/dppjjmuyb/image/upload";
export const cloudinaryPreset = "hackathon-uploads";

export const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryPreset);

  const response = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  return data.secure_url;
};
