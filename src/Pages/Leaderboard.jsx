import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard/`, {
      withCredentials: true,
       headers: {
          "Content-Type": "application/json"
          
        },
    });
    console.log(response.data);

    // Transform backend response into frontend format
    return response.data.map((item) => ({
      username: item.username2
        ? `${item.username1} & ${item.username2}`
        : item.username1,
      scores: [
        item.problem_1,
        item.problem_2,
        item.problem_3,
        item.problem_4
      ],
      total: item.total_score,
      time: new Date(item.last_submission_time).toLocaleTimeString(),
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const getStudents = async () => {
      const data = await fetchStudents();
      setStudents(data);
    };
    getStudents();
  }, []);

  // Sort by total score (descending)
  const sortedData = [...students].sort((a, b) => b.total - a.total);

  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage)); // at least 1
  const startIndex = page * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePrev = () => {
    setPage((p) => Math.max(p - 1, 0));
  };

  const handleNext = () => {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  };

  return (
    <div className="orbitron h-[100vh] w-[100vw] bg-gradient-to-b from-[#2A2255] to-[#0C091F] box-border overflow-x-hidden">
      <nav>
        <Navbar />
      </nav>

      <div className="mt-[2.1%] w-full text-center font-bold text-4xl md:text-5xl lg:text-[50px] text-[#FFFFFF] mx-auto tracking-wide">
        LEADERBOARDS
      </div>

      {/* Table */}
      <div className="mt-10 w-[80%] h-[65%] border-[2px] rounded-[10px] border-[#6435DD] bg-transparent flex flex-col mx-auto">
        <table className="w-full table-fixed text-center text-white border-collapse tracking-wider">
          <thead className="border-b-[2px] border-[#6435DD] text-xl font-bold">
            <tr>
              <th className="py-5 w-[10%]">RANK</th>
              <th className="w-[22%]">USERNAME</th>
              <th className="w-[7%]">Q1</th>
              <th className="w-[7%]">Q2</th>
              <th className="w-[7%]">Q3</th>
              <th className="w-[7%]">Q4</th>
              <th className="w-[13%]">TIME</th>
              <th className="w-[13%]">SCORE</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((student, idx) => (
              <tr
                key={`${student.username}-${idx}`}
                className="text-md hover:scale-102 hover:shadow-xl duration-400"
              >
                <td className="py-[2.3%]">{startIndex + idx + 1}</td>
                <td className="font-bold">{student.username.toUpperCase()}</td>
                {student.scores.map((s, i) => (
                  <td key={i}>{s}</td>
                ))}
                <td>{student.time}</td>
                <td className="font-bold text-xl">{student.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="m-auto flex justify-center items-center gap-10 p-5">
          {/* Prev button */}
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-[5px] border-[1px] border-[#6435DD]  
              ${
                page === 0
                  ? "bg-[#1B0E3B] text-[#3D257A] cursor-not-allowed"
                  : "bg-[#6435DD] text-white hover:bg-[#7162e0] cursor-pointer hover:shadow-2xl hover:scale-105 duration-300"
              }`}
          >
            <FaArrowLeft />
          </button>

          <span className="text-white">
            {page + 1} / {totalPages}
          </span>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={page === totalPages - 1}
            className={`w-10 h-10 flex items-center justify-center rounded-[5px] border-[1px] border-[#6435DD]  
              ${
                page === totalPages - 1
                  ? "bg-[#1B0E3B] text-[#3D257A] cursor-not-allowed"
                  : "bg-[#6435DD] text-white hover:bg-[#7162e0] cursor-pointer hover:shadow-2xl hover:scale-105"
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
