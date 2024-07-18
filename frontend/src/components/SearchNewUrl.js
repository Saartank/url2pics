import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import ShowImages from "./ShowImages";
import sampleQueryResult from "../sample_data/query-result.json";
import { queryUrl } from "@/utils/query-apis";
import Spinner from "./Spinner";
const SearchNewUrl = ({ token }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [displayUrl, setDisplayUrl] = useState(
    "https://en.wikipedia.org/wiki/Coriander"
  );

  const handleSearch = async () => {
    try {
      setUrl("");
      setDisplayUrl(url);
      setLoading(true);
      const result = await queryUrl(url, token);
      setQueryResult(result);
    } catch (error) {
      console.error("Failed to fetch images: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="bg-white rounded-lg shadow-lg w-full px-5 py-4 text-center min-h-[84vh]">
        <div className="flex items-center justify-center space-x-3">
          <input
            type="text"
            placeholder="Paste your URL here"
            className="w-2/3 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <FiArrowRight size={24} />
          </button>
        </div>
        <div className="flex justify-center mt-3">
          <div className="text-left">
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {displayUrl}
            </a>
          </div>
        </div>
        <div className="mt-5">
          {loading ? (
            <Spinner />
          ) : queryResult ? (
            <ShowImages images={queryResult.images} />
          ) : (
            <ShowImages images={sampleQueryResult.images} />
          )}
        </div>
      </main>
    </>
  );
};

export default SearchNewUrl;
