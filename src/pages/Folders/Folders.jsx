import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getFolders, getSubfolders, renameFolder, deleteFolder } from "../../api/folders";
import { FiFolder, FiEdit2, FiTrash2, FiChevronRight, FiSave, FiX } from "react-icons/fi";

export default function Folders({ currentFolderId, onFolderSelect, refreshKey, onActionComplete }) {
  const [folders, setFolders] = useState([]);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: "Root" }]);
  const [folderCache, setFolderCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const res = currentFolderId 
        ? await getSubfolders(currentFolderId)
        : await getFolders();
      
      setFolders(res.data.folders || []);

      const newCache = { ...folderCache };
      res.data.folders?.forEach(folder => {
        newCache[folder.id] = folder.name;
      });
      setFolderCache(newCache);

      if (currentFolderId) {
        buildBreadcrumbs(currentFolderId, newCache);
      } else {
        setBreadcrumbs([{ id: null, name: "Root" }]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error loading folders");
    } finally {
      setIsLoading(false);
    }
  };

  const buildBreadcrumbs = async (folderId, cache) => {
    const crumbs = [{ id: null, name: "Root" }];
    let currentId = folderId;
    const tempCache = { ...cache };

    while (currentId && tempCache[currentId]) {
      crumbs.push({ id: currentId, name: tempCache[currentId] });
      const folder = folders.find(f => f.id === currentId) || 
                    Object.values(tempCache).find(f => f.id === currentId);
      currentId = folder?.parent_id;
    }

    setBreadcrumbs(crumbs);
  };

  const handleRename = async (folderId, newName) => {
    if (!newName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    try {
      await renameFolder(folderId, newName);
      toast.success("Folder renamed successfully!");
      setEditingFolderId(null);
      
      setFolderCache(prev => ({
        ...prev,
        [folderId]: newName
      }));
      
      await onActionComplete();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rename folder");
    }
  };

  const handleDelete = async (folderId) => {
    try {
      await deleteFolder(folderId);
      await onActionComplete();
      toast.success("Folder moved to trash", { autoClose: 3000 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete folder", {
        autoClose: 3000,
      });
    }
  };

  const navigateToFolder = (folderId) => {
    onFolderSelect(folderId);
  };

  useEffect(() => {
    fetchFolders();
  }, [currentFolderId, refreshKey]);

  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1 mb-4 text-sm text-gray-600 flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <FiChevronRight className="mx-1 text-gray-400 h-4 w-4" />}
            <button
              onClick={() => navigateToFolder(crumb.id)}
              className={`hover:text-blue-600 transition-colors ${
                currentFolderId === crumb.id 
                  ? "font-medium text-blue-700" 
                  : ""
              }`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : folders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiFolder className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">
            {currentFolderId ? "This folder is empty" : "No folders yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {folders.map((folder) => (
            <div 
              key={folder.id} 
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all"
            >
              {editingFolderId === folder.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleRename(folder.id, newFolderName)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRename(folder.id, newFolderName)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiSave className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingFolderId(null);
                        setNewFolderName("");
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      <FiX className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => navigateToFolder(folder.id)}
                    className="w-full text-left flex items-center gap-3 hover:text-blue-600 transition-colors"
                  >
                    <FiFolder className="h-6 w-6 text-blue-500 flex-shrink-0" />
                    <span className="font-medium truncate">{folder.name}</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingFolderId(folder.id);
                        setNewFolderName(folder.name);
                      }}
                      className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(folder.id)}
                      className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}