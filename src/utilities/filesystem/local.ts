const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../../public/uploads');

/**
 * Upload file to local
 * 
 * @param file 
 * @param directory 
 * @returns 
 */
const upload = async (
  file: Express.Multer.File,
  directory: string = '',
): Promise<any> => {
  try {
    const filename = file.originalname;

    const uploadDir = path.join(UPLOAD_DIR, directory);
    const filePath = path.join(uploadDir, filename);
    const publicFilePath = path.join(directory, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    return publicFilePath;
  } catch (error: any) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

/**
 * Removes local file
 * 
 * @param filePath 
 */
const remove = async (
  filePath: string,
): Promise<void> => {
  try {
    const fullPath = path.join(UPLOAD_DIR, filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error: any) {
    throw new Error(`Error removing file: ${error.message}`);
  }
};

/**
 * Updates local file
 * 
 * @param oldFilePath 
 * @param newFile 
 * @param directory 
 * @returns 
 */
const update = async (
  oldFilePath: string,
  newFile: Express.Multer.File,
  directory: string = '',
): Promise<any> => {
  try {
    await remove(oldFilePath);

    return await upload(newFile, directory);
  } catch (error: any) {
    throw new Error(`Error updating file: ${error.message}`);
  }
};

module.exports = { upload, remove, update };
