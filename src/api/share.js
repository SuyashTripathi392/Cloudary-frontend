import api from "./axios"; // Axios instance

// Generate share link for a file
export const generateShareLink = (fileId, body) => {
  // body = { share_type, permission, shared_with, expires_in }
  return api.post(`/share/${fileId}`, body);
};

export const getFileByShareToken = (token) => {
  return api.get(`/shared/${token}`);
};

export const getPrivateSharedFile = (shareId) => {
  return api.get(`/private/shared/${shareId}`); // matches backend route
};


// Get all files shared with logged-in user
export const getSharedWithMe = () => {
  return api.get("/shared-with-me"); // match backend route
};

// Delete a shared file (remove from "shared with me")
export const removeSharedFile = (shareId) => {
  return api.delete(`/shared-with-me/${shareId}`);
};
