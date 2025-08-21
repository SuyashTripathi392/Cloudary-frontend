import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getFiles, renameFile, deleteFile } from "../../api/files";
import { getFolders } from "../../api/folders";
import ShareFileModal from "../../components/ShareFileModal";
import { FiFile, FiEdit2, FiTrash2, FiShare2, FiX, FiCheck } from "react-icons/fi";

export default function Files({ currentFolderId, refreshKey }) {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [editingFileId, setEditingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [sharingFileId, setSharingFileId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [filesRes, foldersRes] = await Promise.all([
        getFiles(currentFolderId),
        getFolders(currentFolderId)
      ]);
      setFiles(filesRes.data.files || []);
      setFolders(foldersRes.data.folders || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error loading content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async (fileId) => {
    if (!newFileName.trim()) {
      toast.error("File name cannot be empty");
      return;
    }

    try {
      await renameFile(fileId, newFileName);
      toast.success("File renamed successfully!");
      setEditingFileId(null);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rename file");
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      toast.success("File deleted successfully!");
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting file");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentFolderId, refreshKey]);

  const isEmpty = files.length === 0 && folders.length === 0;

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-8 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            {!currentFolderId
              ? "Upload your first files and folders"
              : "No content in this folder"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
            >
              {editingFileId === file.id ? (
                <div className="flex items-center gap-3 w-full">
                  <FiFile className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleRename(file.id)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRename(file.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <FiCheck className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingFileId(null);
                        setNewFileName("");
                      }}
                      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiFile className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <a
                      href={file.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {file.name}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingFileId(file.id);
                        setNewFileName(file.name);
                      }}
                      className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setSharingFileId(file.id)}
                      className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Share"
                    >
                      <FiShare2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {sharingFileId && (
        <ShareFileModal
          fileId={sharingFileId}
          onClose={() => setSharingFileId(null)}
        />
      )}
    </div>
  );
}