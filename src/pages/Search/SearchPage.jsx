import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchFilesAndFolders } from "../../api/search";
import Folders from "../Folders/Folders";
import Files from "../Files/Files";
import { FiFolder, FiFile, FiArrowLeft, FiHome } from "react-icons/fi";
import { toast } from "react-toastify";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [searchResults, setSearchResults] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchFilesAndFolders(query);
        setSearchResults(res.data);
      } catch (err) {
        toast.error("Failed to load search results");
        setSearchResults({ files: [], folders: [] });
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [query]);

  const handleActionComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (currentFolderId) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <button
          onClick={() => setCurrentFolderId(null)}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Search Results
        </button>

        <Folders
          currentFolderId={currentFolderId}
          onFolderSelect={setCurrentFolderId}
          refreshKey={refreshKey}
          onActionComplete={handleActionComplete}
        />
        <Files
          currentFolderId={currentFolderId}
          refreshKey={refreshKey}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mt-1">
            {searchResults.folders.length + searchResults.files.length} results found
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiHome className="h-5 w-5" />
          Go to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Folders Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-800">
              <FiFolder className="text-blue-500" />
              Folders
              <span className="text-sm font-normal text-gray-500">
                ({searchResults.folders.length})
              </span>
            </h2>
            
            {searchResults.folders.length === 0 ? (
              <p className="text-gray-500 py-4">No folders match your search</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {searchResults.folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => {
                      setCurrentFolderId(folder.id);
                      setRefreshKey(prev => prev + 1);
                    }}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors"
                  >
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiFolder className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-800 truncate">
                      {folder.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Files Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-gray-800">
              <FiFile className="text-blue-500" />
              Files
              <span className="text-sm font-normal text-gray-500">
                ({searchResults.files.length})
              </span>
            </h2>
            
            {searchResults.files.length === 0 ? (
              <p className="text-gray-500 py-4">No files match your search</p>
            ) : (
              <div className="space-y-2">
                {searchResults.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <FiFile className="h-5 w-5 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {file.name}
                      </span>
                    </div>
                    <a
                      href={file.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;