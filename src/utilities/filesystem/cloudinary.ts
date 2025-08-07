const storage = require("../../config/storage");

/**
 * Upload file to Cloudinary
 *
 * @param file - Multer file
 * @param directory - Directory path
 * @returns
 */
const upload = async (
  file: Express.Multer.File,
  directory: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file || !file.buffer) {
        return reject(new Error("Invalid or empty file"));
      }

      const uploadOptions: any = {
        folder: directory,
        format: "webp",
        resource_type: "image",
        transformation: [],
      };

      const stream = storage.uploader.upload_stream(
        uploadOptions,
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

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
const remove = async (filePath: string): Promise<void> => {
  try {
    const parsed = new URL(filePath);
    const parts = parsed.pathname.split("/");
    const publicId = parts
      .slice(-2)
      .join("/")
      .replace(/\.[^/.]+$/, "")
      .replace(/\.webp$/, "");

    await storage.uploader.destroy(publicId, {
      resource_type: "image",
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
  directory: string
): Promise<string> => {
  try {
    if (oldFilePath) await remove(oldFilePath);
    return await upload(newFile, directory);
  } catch (error: any) {
    throw new Error(`Error updating Cloudinary file: ${error.message}`);
  }
};

module.exports = { upload, remove, update };

const storage = require("../../config/storage");

const upload = async (file: any, directory: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file || !file.data || file.data.length === 0) {
        return reject(new Error("Invalid or empty file"));
      }

      const stream = storage.uploader.upload_stream(
        {
          format: "webp",
          resource_type: "image",
          directory,
        },
        (error: any, result: any) => {
          if (error) return reject(new Error(error));
          resolve({
            secure_url: result.secure_url,
            name: file.name,
          });
        }
      );

      stream.end(file.data);
    } catch (error) {
      reject(error);
    }
  });
};
exports.upload = upload;

const remove = async (name: string) => {
  const arr = name.split("/");
  const publicId = arr
    .slice(-2)
    .join("/")
    .replace(/\.[^/.]+$/, "");

  return storage.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};
exports.remove = remove;

exports.update = async (
  oldFilePath: string,
  newFile: any,
  directory: string
) => {
  try {
    if (oldFilePath) {
      // Delete old file if it exists
      await remove(oldFilePath);
    }

    // Upload new file
    const uploadedFile: any = await upload(newFile, directory);
    return uploadedFile.secure_url;
  } catch (error: any) {
    throw new Error(`Error updating file: ${error.message}`);
  }
};
