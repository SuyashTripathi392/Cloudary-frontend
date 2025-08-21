import api from "./axios";

// Get files in root or subfolder
export const getFiles = (folderId = null) => {
  const url = folderId ? `/files/folder/${folderId}/files` : `/files/root`;
  return api.get(url);
};

// Upload file to root or folder
export const uploadFile = (file, folderId = null) => {
  const formData = new FormData();
  formData.append("file", file);

  const url = folderId ? `/files/upload/${folderId}` : "/files/upload";
  return api.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

// Rename file
export const renameFile = (id, newName) => api.patch(`/files/${id}/rename`, { name: newName });

// Move file to trash
export const deleteFile = (id) => api.patch(`/files/${id}/trash`);

// Restore file from trash
export const restoreFile = (id) => api.patch(`/files/${id}/restore`);

// Get trashed files
export const getTrashFiles = () => api.get("/files/trash");

// Permanently delete file
export const permanentDeleteFile = (id) => api.delete(`/files/${id}/permanent`);
