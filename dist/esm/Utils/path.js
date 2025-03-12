import path from 'path';
import { fileURLToPath } from 'url';

/**
 * @description Get the dirname from import.meta.url
 * @param {string} importMetaUrl - The import.meta.url value
 * @returns {object} - Object containing __dirname and __filename
 */
export const getDirname = importMetaUrl => {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);
  return {
    __dirname,
    __filename
  };
};

/**
 * @description Get the current file's dirname directly
 * @returns {string} - The current directory path
 */
export const getCurrentDirname = () => {
  return path.dirname(fileURLToPath(import.meta.url));
};
//# sourceMappingURL=path.js.map