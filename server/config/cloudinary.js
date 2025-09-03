const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// server/controllers/botController.js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'recallr', // change folder name as needed
//     allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp','pdf'],
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check file mimetype
    if (file.mimetype === "application/pdf") {
      return {
        folder: "recallr",
        resource_type: "raw", // important for PDFs
        type: "upload",
        use_filename: true,
        unique_filename: false,
        format: "pdf",
      };
    }

    // For images
    return {
      folder: "recallr",
      allowed_formats: ["jpg", "png", "jpeg", "svg", "webp"],
      type: "upload",

      resource_type: "image",
      use_filename: true,
      unique_filename: false,
    };
  },
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "user_profiles" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(file.buffer);
  });
};

module.exports = { cloudinary, storage, uploadToCloudinary };
