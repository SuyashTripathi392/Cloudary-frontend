import { useState } from "react";
import { generateShareLink } from "../api/share";
import { toast } from "react-toastify";

const ShareFileModal = ({ fileId, onClose }) => {
  const [shareType, setShareType] = useState("public");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [expiresIn, setExpiresIn] = useState(60); // in minutes

  const handleShare = async () => {
  try {
    const body = {
      share_type: shareType,
      permission,
      shared_with: shareType === "private" ? email : undefined,
      expires_in: expiresIn,
    };

    const res = await generateShareLink(fileId, body);

    const link = res.data.link;

    // ✅ Copy link to clipboard
    await navigator.clipboard.writeText(link);

    if (shareType === "private") {
      toast.success(`File shared privately with ${email}`);
    } else {
      toast.success("Public share link copied to clipboard!");
    }

    console.log("Share Link:", link);
    onClose();
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Share File</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Share Type</label>
              <select
                value={shareType}
                onChange={(e) => setShareType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {shareType === "private" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter recipient's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permission</label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="view">View Only</option>
                <option value="edit">Can Edit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires In (minutes)</label>
              <input
                type="number"
                placeholder="Expiry duration"
                value={expiresIn}
                onChange={(e) => setExpiresIn(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareFileModal;
