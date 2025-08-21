// src/pages/Trash/Trash.jsx
import { useEffect, useState } from "react";
import { 
  getTrashFolders, restoreFolder, permanentDeleteFolder 
} from "../../api/folders";
import { 
  getTrashFiles, restoreFile, permanentDeleteFile 
} from "../../api/files";
import { toast } from "react-toastify";
import { FiFolder, FiFile, FiTrash2, FiRotateCw, FiAlertTriangle } from "react-icons/fi";

export default function Trash() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const [folderRes, fileRes] = await Promise.all([
        getTrashFolders(),
        getTrashFiles()
      ]);
      setFolders(folderRes.data.trash || []);
      setFiles(fileRes.data.trash || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching trash");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreFolder = async (id) => {
    try {
      await restoreFolder(id);
      toast.success("Folder restored successfully");
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error restoring folder");
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await permanentDeleteFolder(id);
      toast.success("Folder permanently deleted");
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting folder");
    }
  };

  const handleRestoreFile = async (id) => {
    try {
      await restoreFile(id);
      toast.success("File restored successfully");
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error restoring file");
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await permanentDeleteFile(id);
      toast.success("File permanently deleted");
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting file");
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const isEmpty = folders.length === 0 && files.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiTrash2 className="text-red-500" />
          Trash
        </h1>
        <button 
          onClick={fetchTrash}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
        >
          <FiRotateCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isEmpty ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600">Your trash is empty</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Folders Section */}
          {folders.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-800">
                <FiFolder className="text-blue-500" />
                Folders in Trash
                <span className="text-sm font-normal text-gray-500">
                  ({folders.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {folders.map((folder) => (
                  <div 
                    key={folder.id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 truncate">
                        <FiFolder className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <span className="font-medium truncate">{folder.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestoreFolder(folder.id)}
                          className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <FiRotateCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Forever"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          {files.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-gray-800">
                <FiFile className="text-blue-500" />
                Files in Trash
                <span className="text-sm font-normal text-gray-500">
                  ({files.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 truncate">
                        <FiFile className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        <span className="font-medium truncate">{file.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestoreFile(file.id)}
                          className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Restore"
                        >
                          <FiRotateCw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Forever"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
