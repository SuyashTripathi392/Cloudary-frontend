import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "../api/files";
import { createFolder } from "../api/folders";
import { FiUpload, FiFolderPlus, FiPlus } from "react-icons/fi";

const ActionMenu = ({ currentFolderId, onActionComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!event.target.closest(".main-action-button")) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // File select + preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      await uploadFile(selectedFile, currentFolderId);
      await onActionComplete();
      toast.success("File uploaded successfully!", { autoClose: 3000 });
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "File upload failed", {
        autoClose: 3000,
      });
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    try {
      await createFolder(folderName, currentFolderId);
      await onActionComplete();
      toast.success("Folder created successfully!", { autoClose: 3000 });
      setFolderName("");
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create folder", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative">
      {/* Main Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="main-action-button flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
      >
        <FiPlus className="h-5 w-5" />
        <span className="font-medium">Create / Upload</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={menuRef} 
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
              Add New Content
            </h3>

            {/* Folder Creation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <FiFolderPlus className="text-blue-500" />
                <label className="text-sm font-medium">Create Folder</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                />
                <button
                  onClick={handleCreateFolder}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Create
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <FiUpload className="text-blue-500" />
                <label className="text-sm font-medium">Upload File</label>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className={`w-full p-3 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                    selectedFile ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {selectedFile ? (
                    <span className="text-sm font-medium text-blue-600 truncate max-w-full">
                      {selectedFile.name}
                    </span>
                  ) : (
                    <>
                      <FiUpload className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-sm text-gray-600">Click to select file</span>
                    </>
                  )}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />

                {/* File Preview */}
                {selectedFile && previewUrl && (
                  <div className="border p-3 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-sm mb-2 text-gray-700">Preview:</h4>
                    <div className="max-h-40 overflow-auto">
                      {selectedFile.type.startsWith("image/") && (
                        <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded" />
                      )}
                      {selectedFile.type.startsWith("audio/") && (
                        <audio controls src={previewUrl} className="w-full" />
                      )}
                      {selectedFile.type.startsWith("video/") && (
                        <video controls src={previewUrl} className="w-full rounded" />
                      )}
                      {!selectedFile.type.startsWith("image/") &&
                       !selectedFile.type.startsWith("audio/") &&
                       !selectedFile.type.startsWith("video/") && (
                        <div className="flex items-center gap-2 p-2 bg-white rounded border">
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedFile && (
                  <button
                    onClick={handleUpload}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
                  >
                    Upload File
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;