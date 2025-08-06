const storage = require('../../config/storage');

/**
 * Upload file to Cloudinary
 * 
 * @param file - Multer file
 * @param directory - Directory path
 * @returns 
 */
const upload = async (
  file: Express.Multer.File,
  directory: string,
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file || !file.buffer) {
        return reject(new Error('Invalid or empty file'));
      }

      const uploadOptions: any = {
        folder: directory,
        format: 'webp',
        resource_type: 'image',
        transformation: [],
      };

      const stream = storage.uploader.upload_stream(uploadOptions, (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      });

      stream.end(file.buffer);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Remove file from Cloudinary
 * 
 * @param filePath - Public Cloudinary URL or relative path
 * @returns 
 */
const remove = async (
  filePath: string,
): Promise<void> => {
  try {
    const parsed = new URL(filePath);
    const parts = parsed.pathname.split('/');
    const publicId = parts.slice(-2).join('/').replace(/\.[^/.]+$/, '').replace(/\.webp$/, '');

    await storage.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
  } catch (error: any) {
    throw new Error(`Error removing Cloudinary file: ${error.message}`);
  }
};

/**
 * Update Cloudinary file
 * 
 * @param oldFilePath 
 * @param newFile 
 * @param directory 
 * @returns 
 */
const update = async (
  oldFilePath: string,
  newFile: Express.Multer.File,
  directory: string,
): Promise<string> => {
  try {
    if (oldFilePath) await remove(oldFilePath);
    return await upload(newFile, directory);
  } catch (error: any) {
    throw new Error(`Error updating Cloudinary file: ${error.message}`);
  }
};

module.exports = { upload, remove, update };
