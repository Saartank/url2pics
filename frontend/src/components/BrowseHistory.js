import React, { useState, useEffect } from "react";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import moment from "moment";
import "moment-timezone";
import { getAllQueries, deleteQuery } from "@/utils/query-apis";
import Spinner from "./Spinner";
import ShowImagesModal from "./ShowImagesModal";
const BrowseHistory = ({ token }) => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await getAllQueries(token);
        setHistoryList(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch history: ", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteQuery(id, token);
      setHistoryList(historyList.filter((item) => item.id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Failed to delete query: ", error);
      setLoading(false);
    }
  };

  const handleCameraClick = (id) => {
    setSelectedQueryId(id);
    setIsModalOpen(true);
  };

  function formatLocalTime(utcDateString) {
    const utcMoment = moment.utc(utcDateString);
    return utcMoment.local().format("MMM D, YYYY, h:mm A");
  }

  return (
    <div>
      <main className="bg-white rounded-lg shadow-lg w-full px-5 py-4 text-center min-h-[75vh]">
        {loading ? (
          <Spinner />
        ) : (
          historyList.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center my-2 border-b pb-2"
            >
              <div className="text-left">
                <button
                  onClick={() => handleCameraClick(item.id)}
                  className="text-blue-500 hover:underline focus:outline-none"
                >
                  {item.url}
                </button>
                <div className="text-gray-500 text-sm">
                  {formatLocalTime(item.created_at)}
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleCameraClick(item.id)}
                  className="text-blue-500 hover:text-purple-500"
                  title="Click to show captured images"
                >
                  <FiCamera size={30} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete past query"
                >
                  <FiTrash2 size={30} />
                </button>
              </div>
            </div>
          ))
        )}
      </main>
      {isModalOpen && (
        <ShowImagesModal
          onCloseSetFalse={setIsModalOpen}
          queryId={selectedQueryId}
          token={token}
        />
      )}
    </div>
  );
};

export default BrowseHistory;
