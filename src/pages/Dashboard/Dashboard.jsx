import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ActionMenu from "../../components/ActionMenu";
import Folders from "../Folders/Folders";
import Files from "../Files/Files";
import Trash from "../Trash/Trash";

const Dashboard = () => {
  const [showTrash, setShowTrash] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleActionComplete = () => {
    setRefreshKey((prev) => prev + 1);
    toast.dismiss();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">My Cloud Storage</h1>
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Shared With Me Button */}
          <button
            onClick={() => navigate("/shared-with-me")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Shared With Me
          </button>

          {/* Action Menu Button */}
          {!showTrash && (
            <ActionMenu
              currentFolderId={currentFolderId}
              onActionComplete={handleActionComplete}
            />
          )}

          {/* Trash Toggle Button */}
          <button
            onClick={() => setShowTrash(!showTrash)}
            className={`flex items-center px-4 py-2 rounded-lg text-white ${
              showTrash ? "bg-red-700" : "bg-red-600"
            } hover:bg-red-700 transition-colors shadow-sm`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {showTrash ? "Hide Trash" : "Show Trash"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm min-h-[70vh] border border-gray-100">
        {showTrash ? (
          <Trash onActionComplete={handleActionComplete} />
        ) : (
          <>
            <Folders
              currentFolderId={currentFolderId}
              onFolderSelect={setCurrentFolderId}
              refreshKey={refreshKey}
              onActionComplete={handleActionComplete}
            />
            <Files currentFolderId={currentFolderId} refreshKey={refreshKey} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;