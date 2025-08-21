// src/api/search.js
import api from "./axios"; // pre-configured axios instance

// ✅ Search files & folders
export const searchFilesAndFolders = (query) => {
  return api.get("/search", {
    params: { query },
  });
};
