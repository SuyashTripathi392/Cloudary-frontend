import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSharedWithMe, removeSharedFile } from "../../api/share";
import { toast } from "react-toastify";
import { FiFile, FiDownload, FiHome, FiTrash2, FiUser, FiEye, FiEdit } from "react-icons/fi";

const SharedWithMeList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const res = await getSharedWithMe();
        setFiles(res.data.files || []);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSharedFiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this file from your shared list?")) return;
    
    try {
      await removeSharedFile(id);
      setFiles((prev) => prev.filter((file) => file.id !== id));
      toast.success("File removed from your shared list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove file");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading shared files...</p>
      </div>
    </div>
  );

  if (files.length === 0) return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiHome className="h-5 w-5" />
          Go to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiFile className="h-10 w-10 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No shared files yet</h2>
        <p className="text-gray-500 mb-4">When someone shares files with you, they'll appear here</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiHome className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiFile className="text-blue-500" />
            Files Shared With Me
          </h1>
          <p className="text-gray-600 mt-1">{files.length} shared item{files.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiHome className="h-5 w-5" />
          Go to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiFile className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">{file.filename}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {file.permission === 'view' ? (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <FiEye className="h-3 w-3" />
                        View only
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <FiEdit className="h-3 w-3" />
                        Can edit
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiUser className="h-4 w-4" />
                <span>Shared by <strong>{file.shared_by || 'Unknown user'}</strong></span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {file.signed_url && (
                  <button
                    onClick={() => window.open(file.signed_url, "_blank")}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <FiDownload className="h-4 w-4" />
                    Download
                  </button>
                )}
                <button
                  onClick={() => handleDelete(file.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors text-sm font-medium"
                  title="Remove from shared list"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedWithMeList;