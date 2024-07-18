import React, { useState, useEffect } from "react";
import { getQuery } from "@/utils/query-apis";
import ShowImages from "./ShowImages";
import Spinner from "./Spinner";

const ShowImagesModal = ({ onCloseSetFalse, queryId, token }) => {
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const result = await getQuery(queryId, token);
        setQueryResult(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch history: ", error);
        setLoading(false);
      }
    };

    fetchQuery();
  }, [queryId, token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-[63vw] bg-white rounded-lg shadow dark:bg-gray-700 min-h-[75vh]">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <a
                href={queryResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-500 hover:underline focus:outline-none"
              >
                {queryResult.url}
              </a>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => onCloseSetFalse(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <ShowImages images={queryResult.images} />
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => onCloseSetFalse(false)}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowImagesModal;
