import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import alien from "../assets/alien.png";

function Results() {
  const [result, setResult] = useState({
    name: "",
    level: "",
    rank: 0,
    score: 0,
    totalSubmissions: 0,
    accuracy: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/result")
      .then((res) => setResult(res.data))
      .catch((err) => console.error("Error fetching result:", err));
  }, []);

  return (
    <div className="orbitron min-h-screen w-full bg-gradient-to-b from-[#2A2255] to-[#0C091F] box-border overflow-x-hidden flex flex-col items-center">
      <nav className="w-full">
        <Navbar />
      </nav>

      <div className="mt-8 w-full text-center font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-wide">
        RESULT
      </div>

      <div className="mt-8 w-11/12 flex flex-col lg:flex-row justify-center items-start gap-8 lg:gap-16">
        {/* Left Part */}
        <div className="flex flex-col justify-center items-center gap-4 lg:w-1/2 w-full">
          <img
            src={alien}
            alt="Alien"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
          />
          <div className="font-bold text-2xl sm:text-3xl md:text-4xl text-center text-white">
            {result.name || "Loading Name..."}
          </div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-[#6453DD] flex justify-center items-center">
            <div className="font-bold text-xl sm:text-2xl md:text-3xl text-white text-center">
              {result.level || "Unknown"}
            </div>
          </div>
        </div>

        {/* Right Part */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full lg:w-1/2">
          {/* Rank */}
          <div className="w-full rounded-lg border-2 border-[#6453DD] flex flex-col">
            <div className="h-24 sm:h-32 md:h-40 rounded-t-lg bg-[#6453DD] flex items-center justify-center">
              <div className="font-bold text-4xl sm:text-5xl md:text-6xl text-white text-center">
                {result.rank}
              </div>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-white text-center">
                RANK
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="w-full rounded-lg border-2 border-[#6453DD] flex flex-col">
            <div className="h-24 sm:h-32 md:h-40 rounded-t-lg bg-[#6453DD] flex items-center justify-center">
              <div className="font-bold text-4xl sm:text-5xl md:text-6xl text-white text-center">
                {result.score}
              </div>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-white text-center">
                SCORE
              </div>
            </div>
          </div>

          {/* Total Submissions */}
          <div className="w-full rounded-lg border-2 border-[#6453DD] flex flex-col">
            <div className="h-24 sm:h-32 md:h-40 rounded-t-lg bg-[#6453DD] flex items-center justify-center">
              <div className="font-bold text-4xl sm:text-5xl md:text-6xl text-white text-center">
                {result.totalSubmissions}
              </div>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-white text-center">
                TOTAL SUBMISSIONS
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="w-full rounded-lg border-2 border-[#6453DD] flex flex-col">
            <div className="h-24 sm:h-32 md:h-40 rounded-t-lg bg-[#6453DD] flex items-center justify-center">
              <div className="font-bold text-4xl sm:text-5xl md:text-6xl text-white text-center">
                {result.accuracy}%
              </div>
            </div>
            <div className="flex items-center justify-center py-2">
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-white text-center">
                ACCURACY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
