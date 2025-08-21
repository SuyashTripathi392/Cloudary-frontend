import api from "./axios";

// Get root folders
export const getFolders = () => api.get("/folders");

// Get subfolders of a folder
export const getSubfolders = (parentId) => api.get(`/folders/sub/${parentId}`);

// Create new folder (root or subfolder)
export const createFolder = (name, parentId = null) => {
  const url = parentId ? `/folders/create/${parentId}` : `/folders/create`;
  return api.post(url, { name });
};

// Rename folder
export const renameFolder = (id, newName) =>
  api.put(`/folders/${id}`, { name: newName });

// Move folder to trash (soft delete)
export const deleteFolder = (id) => api.delete(`/folders/${id}`);

// Restore folder
export const restoreFolder = (id) => api.put(`/folders/restore/${id}`);

// Get trashed folders
export const getTrashFolders = () => api.get("/folders/trash");

// Permanently delete folder
export const permanentDeleteFolder = (id) =>api.delete(`/folders/permanent/${id}`);
