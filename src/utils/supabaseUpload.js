const supabase = require("../config/supabase");
const fs = require("fs");

async function uploadToSupabase(file, folder = "images") {
  const fileBuffer = await fs.promises.readFile(file.path);

  const filePath =
    `${folder}/${Date.now()}-${file.filename}`;

  const { error } =
    await supabase.storage
      .from("uploads")
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype,
        upsert: false,
      });

  if (error) {
    throw error;
  }

  const { data } =
    supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

  await fs.promises.unlink(file.path);

  return data.publicUrl;
}

module.exports = uploadToSupabase;