const cloudinary = require('cloudinary');

/**
 * It takes a file stream and uploads it to cloudinary
 * @param fileStream - The file stream that you want to upload to Cloudinary.
 * @param {path: string} - The folder in which the file will be uploaded.
 * @returns A promise that resolves to the fileUploaded object.
 */
function uploadToCloudinary(fileStream, path = 'avatars') {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  return new Promise((resolve, reject) => {
    const cloudStream = cloudinary.v2.uploader.upload_stream(
      { folder: `instaclone/${path}` },
      function (err, fileUploaded) {
        if (err) {
          reject(err);
        }

        resolve(fileUploaded);
      }
    );

    fileStream.pipe(cloudStream);
  });
}

module.exports = uploadToCloudinary;
