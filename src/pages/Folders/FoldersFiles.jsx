import { useState, useEffect } from "react";
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  restoreFolder,
  getTrashFolders,
  permanentDeleteFolder,
} from "../../api/folders";
import {
  getRootFiles,
  getFiles,
  uploadFile,
  moveFileToTrash,
  restoreFile,
  getTrashFiles,
  permanentDeleteFile,
  renameFile,
} from "../../api/files";
import { toast } from "react-toastify";

export default function FoldersFiles() {
  // ---------------- Folder states ----------------
  const [folders, setFolders] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  // ---------------- File states ----------------
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [editFileId, setEditFileId] = useState(null);
  const [editFileName, setEditFileName] = useState("");

  // ---------------- Trash (single view) ----------------
  const [trash, setTrash] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  // ---------------- Breadcrumb ----------------
  const [path, setPath] = useState([]);

  // ---------------- Fetch functions ----------------
  const fetchFolders = async () => {
    try {
      const res = await getFolders(currentFolderId);
      setFolders(res.data.folders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching folders");
    }
  };

  const fetchFiles = async () => {
    try {
      const res = currentFolderId ? await getFiles(currentFolderId) : await getRootFiles();
      setFiles(res.data.files);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching files");
    }
  };

  const fetchTrash = async () => {
    try {
      const folderTrashRes = await getTrashFolders();
      const fileTrashRes = await getTrashFiles();
      setTrash([
        ...folderTrashRes.data.trash.map(f => ({ ...f, type: "folder" })),
        ...fileTrashRes.data.trash.map(f => ({ ...f, type: "file" })),
      ]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching trash");
    }
  };

  useEffect(() => {
    fetchFolders();
    fetchFiles();
    fetchTrash();
  }, [currentFolderId]);

  // ---------------- Breadcrumb ----------------
  const handleFolderClick = (folder) => {
    setCurrentFolderId(folder.id);
    setPath([...path, folder]);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCurrentFolderId(null);
      setPath([]);
    } else {
      const newPath = path.slice(0, index + 1);
      setPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  };

  // ---------------- Folder operations ----------------
  const handleCreateFolder = async () => {
    if (!newFolder) return toast.error("Enter folder name");
    try {
      await createFolder(newFolder, currentFolderId);
      setNewFolder("");
      toast.success("Folder created");
      fetchFolders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating folder");
    }
  };

  const handleRenameFolder = async (id) => {
    try {
      await renameFolder(id, editFolderName);
      setEditFolderId(null);
      toast.success("Folder renamed");
      fetchFolders();
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error renaming folder");
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await deleteFolder(id);
      toast.success("Folder moved to trash");
      fetchFolders();
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting folder");
    }
  };

  const handleRestoreFolder = async (id) => {
    try {
      await restoreFolder(id);
      toast.success("Folder restored");
      fetchFolders();
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error restoring folder");
    }
  };

  const handlePermanentDeleteFolder = async (id) => {
    try {
      await permanentDeleteFolder(id); // permanent delete API
      toast.success("Folder permanently deleted");
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error permanently deleting folder");
    }
  };

  // ---------------- File operations ----------------
  const handleUploadFile = async () => {
    if (!newFile) return toast.error("Select a file");
    const formData = new FormData();
    formData.append("file", newFile);
    try {
      await uploadFile(formData, currentFolderId);
      setNewFile(null);
      toast.success("File uploaded");
      fetchFiles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error uploading file");
    }
  };

  const handleRenameFile = async (id) => {
    try {
      await renameFile(id, editFileName);
      setEditFileId(null);
      toast.success("File renamed");
      fetchFiles();
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error renaming file");
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await moveFileToTrash(id);
      toast.success("File moved to trash");
      fetchFiles();
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting file");
    }
  };

  const handleRestoreFile = async (id) => {
    try {
      await restoreFile(id);
      toast.success("File restored");
      fetchFiles();
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error restoring file");
    }
  };

  const handlePermanentDeleteFile = async (id) => {
    try {
      await permanentDeleteFile(id);
      toast.success("File permanently deleted");
      fetchTrash();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error permanently deleting file");
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Folders & Files</h1>

      {/* Breadcrumb */}
      <div className="mb-4 flex gap-2">
        <span className="cursor-pointer text-blue-600" onClick={() => handleBreadcrumbClick(-1)}>Root</span>
        {path.map((folder, index) => (
          <span key={folder.id}>
            / <span className="cursor-pointer text-blue-600" onClick={() => handleBreadcrumbClick(index)}>{folder.name}</span>
          </span>
        ))}
      </div>

      {/* Folder Section */}
      {!showTrash && (
        <div className="mb-6">
          <h2 className="font-bold mb-2">Folders</h2>
          <div className="flex gap-2 mb-2">
            <input type="text" value={newFolder} onChange={(e) => setNewFolder(e.target.value)} className="border p-2" placeholder="Folder name"/>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateFolder}>Create Folder</button>
          </div>
          <ul>
            {folders.map(folder => (
              <li key={folder.id} className="border p-2 mb-2 flex justify-between items-center">
                <span className="cursor-pointer text-blue-700" onClick={() => handleFolderClick(folder)}>{folder.name}</span>
                <div className="flex gap-2">
                  {editFolderId === folder.id ? (
                    <>
                      <input type="text" value={editFolderName} onChange={(e) => setEditFolderName(e.target.value)} className="border p-1"/>
                      <button onClick={() => handleRenameFolder(folder.id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditFolderId(folder.id); setEditFolderName(folder.name); }} className="bg-yellow-500 text-white px-2 py-1 rounded">Rename</button>
                      <button onClick={() => handleDeleteFolder(folder.id)} className="bg-red-500 text-white px-2 py-1 rounded">Trash</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File Section */}
      {!showTrash && (
        <div className="mb-6">
          <h2 className="font-bold mb-2">Files</h2>
          <div className="flex gap-2 mb-2">
            <input type="file" onChange={(e) => setNewFile(e.target.files[0])} className="border p-2"/>
            <button onClick={handleUploadFile} className="bg-blue-500 text-white px-4 py-2 rounded">Upload File</button>
          </div>
          <ul>
            {files.map(file => (
              <li key={file.id} className="border p-2 mb-2 flex justify-between items-center">
                {file.name}
                <div className="flex gap-2">
                  {editFileId === file.id ? (
                    <>
                      <input type="text" value={editFileName} onChange={(e) => setEditFileName(e.target.value)} className="border p-1"/>
                      <button onClick={() => handleRenameFile(file.id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditFileId(file.id); setEditFileName(file.name); }} className="bg-yellow-500 text-white px-2 py-1 rounded">Rename</button>
                      <button onClick={() => handleDeleteFile(file.id)} className="bg-red-500 text-white px-2 py-1 rounded">Trash</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trash Section */}
      {showTrash && (
        <div className="mb-6">
          <h2 className="font-bold mb-2">Trash (Folders + Files)</h2>
          <ul>
            {trash.map(item => (
              <li key={item.id} className="border p-2 mb-2 flex justify-between items-center">
                {item.name} ({item.type})
                <div className="flex gap-2">
                  <button onClick={() => item.type==="folder" ? handleRestoreFolder(item.id) : handleRestoreFile(item.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Restore</button>
                  <button onClick={() => item.type==="folder" ? handlePermanentDeleteFolder(item.id) : handlePermanentDeleteFile(item.id)} className="bg-red-700 text-white px-2 py-1 rounded">Delete Forever</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => setShowTrash(!showTrash)} className="mt-2 bg-gray-500 text-white px-4 py-2 rounded">
        {showTrash ? "Show Active" : "Show Trash"}
      </button>
    </div>
  );
}