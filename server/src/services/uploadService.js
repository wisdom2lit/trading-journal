const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class UploadService {
  static async uploadImage(buffer, folder = 'trading_journal') {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}

module.exports = UploadService;
