/**
 * Cloud storage library - Cloudinary only.
 */
const cloudinaryStorage = require("./cloudinary");

export const upload = async (...args: any): Promise<any> =>
  await cloudinaryStorage.upload(...args);
export const remove = async (...args: any): Promise<any> =>
  await cloudinaryStorage.remove(...args);
export const update = async (...args: any): Promise<any> =>
  await cloudinaryStorage.update(...args);
