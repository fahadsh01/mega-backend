import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileuploader = async (file) => {
  try {
    if (!file) return null;
    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    console.log("your file is uploaded sucessfully", response.url);
    return response;
  } catch (error) {
    fs.unlinksync(file);
    return null;
  }
};

export { fileuploader };
