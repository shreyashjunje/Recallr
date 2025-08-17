const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "drcjsmewe",
  api_key: "234435247319649",
  api_secret: "H5nC6oIXx-RDQRcJBNsL5js-uLk",
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

module.exports = { cloudinary, storage };
