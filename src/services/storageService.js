import { supabase } from "../lib/supabase"

const BUCKET = "product-images"

/**
 * Upload a single image file to Supabase Storage
 * Returns the public URL
 */
export async function uploadProductImage(file) {
  const ext = file.name.split(".").pop().toLowerCase()
  const allowed = ["jpg", "jpeg", "png", "webp", "avif"]
  if (!allowed.includes(ext)) throw new Error("Only JPG, PNG, WEBP images allowed")
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB")

  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Upload multiple images, returns array of public URLs
 */
export async function uploadProductImages(files) {
  const urls = []
  for (const file of files) {
    const url = await uploadProductImage(file)
    urls.push(url)
  }
  return urls
}

/**
 * Delete an image from storage by its public URL
 */
export async function deleteProductImage(publicUrl) {
  try {
    // Extract path from URL: .../storage/v1/object/public/product-images/products/xxx.jpg
    const marker = `/product-images/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return
    const filePath = publicUrl.slice(idx + marker.length)
    await supabase.storage.from(BUCKET).remove([filePath])
  } catch (e) {
    console.warn("Failed to delete image from storage:", e)
  }
}
