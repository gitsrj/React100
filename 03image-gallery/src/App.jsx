import React, { useEffect, useState } from "react";
import "animate.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineLoading3Quarters, AiOutlineDownload } from "react-icons/ai";

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("nature");

  const fetchImage = async () => {
    setLoading(true);
    try {
      const options = {
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
      };
      const res = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&page=${page}&per_page=12`,
        options
      );
      console.log(res.data);
      setPhotos([...photos, ...res.data.photos]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      
    }
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const search = (e) => {
    e.preventDefault();
    const q = e.target[0].value.trim();
    setPhotos([]);
    setQuery(q);
  };

  useEffect(() => {
    fetchImage();
  }, [page, query]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8 gap-12 animate__animated animate__fadeIn ">
      <h1 className="text-4xl font-bold text-indigo-600 ">📷 Image Gallery</h1>

      <form onSubmit={search}>
        <input
          type="text"
          className="p-3 bg-white rounded-l-lg w-[400px] focus:outline-indigo-500"
          placeholder="Search image here"
          required
        />
        <button className="bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-r-lg hover:scale-105 transition-transform">
          Search
        </button>
      </form>

      {photos.length === 0 && (
        <h1 className="text-4xl font-bold text-center">
          Search Result Not Found
        </h1>
      )}
      <div className="grid lg:grid-cols-4 lg:gap-12 gap-8 w-9/12">
        {photos.map((item, index) => (
          <div key={index} className="bg-white rounded-xl bg-white">
            <img
              src={item.src.medium}
              alt={item.alt}
              className="rounded-t-lg h-[180px] object-cover w-full hover:scale-105 transition-transform duration-300"
            />
            <div className="p-3">
              <h1 className="text-lg font-medium tex-gray-600 capitalize">
                {item.photographer}
              </h1>
              <a
                target="_blank"
                href={item.src.original}
                className="mt-3 block bg-green-400 font-bold py-2 rounded-lg text-center hover:scale-105 transition-transform duration-250"
              >
                <AiOutlineDownload className="text-2xl" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
      )}

      {photos.length > 0 && (
        <button
          onClick={loadMore}
          className="bg-rose-500 py-3 px-16 rounded-lg font-medium txt-white hover:scale-105 transition-transform hover:font-bold"
        >
          Load More
        </button>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
