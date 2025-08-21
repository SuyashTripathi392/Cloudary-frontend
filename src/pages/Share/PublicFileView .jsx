import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFileByShareToken } from "../../api/share";
import { toast } from "react-toastify";
import { FiFile, FiDownload, FiHome } from "react-icons/fi";

const PublicFileView = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await getFileByShareToken(token);
        setFile(res.data.file);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!file) return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiHome className="h-5 w-5" />
          Go to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mx-auto mb-4"
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
        <h2 className="text-xl font-medium text-gray-800 mb-2">File not found</h2>
        <p className="text-gray-500">The file may have been removed or the link expired</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shared File</h1>
          <p className="text-gray-600 mt-1">You can view or download this file</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiHome className="h-5 w-5" />
          Go to Dashboard
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FiFile className="h-8 w-8 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 text-lg">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {file.size ? `Size: ${formatFileSize(file.size)} • ` : ''}
                Shared via Cloudary
              </p>
            </div>
          </div>
          <button
            onClick={() => window.open(file.signedUrl, "_blank")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="h-5 w-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default PublicFileView;