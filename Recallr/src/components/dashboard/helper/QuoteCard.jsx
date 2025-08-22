import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function QuoteCard() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgUrl, setImgUrl] = useState("");

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/helper/get-motivation`);
      console.log("res=>", response);

      // With Axios, data is in response.data (no need for response.json())
      setImgUrl(response.data.image);
      setQuote(response.data.quote);
      setAuthor(response.data.author);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("Failed to load quote. Please try again.");
      // Set fallback quote
      setQuote(
        "The greatest glory in living lies not in never falling, but in rising every time we fall."
      );
      setAuthor("Nelson Mandela");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="max-w-full mx-auto my-8">
      <div
        className="w-full h-64 rounded-2xl shadow-xl flex items-center justify-center text-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full absolute top-0 left-0"></div>

        <div className="relative z-10 text-white px-6 max-w-lg">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading inspirational quote...</p>
            </div>
          ) : error ? (
            <div>
              <p className="text-red-300 mb-2">{error}</p>
              <p className="text-xl italic font-semibold">"{quote}"</p>
              <p className="mt-2 text-sm">— {author}</p>
            </div>
          ) : (
            <>
              <p className="text-xl italic font-semibold">"{quote}"</p>
              <p className="mt-2 text-sm">— {author}</p>
            </>
          )}
        </div>
      </div>

      {/* <div className="mt-4 flex justify-center">
        <RefreshCcw
          onClick={fetchQuote}
          className={`w-10 h-10 cursor-pointer text-white hover:rotate-180 transition-transform duration-500 ${
            loading ? "animate-spin" : ""
          }`}
        />
      </div> */}
    </div>
  );
}
