const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


cloudinary.config({
  cloud_name:"drcjsmewe",
  api_key: "234435247319649",
  api_secret: "H5nC6oIXx-RDQRcJBNsL5js-uLk",
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recallr', // change folder name as needed
    allowed_formats: ['jpg', 'png', 'jpeg', 'svg', 'webp','pdf'],
  },
});

module.exports = { cloudinary, storage };
