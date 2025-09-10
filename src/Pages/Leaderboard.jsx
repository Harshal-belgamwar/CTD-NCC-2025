import { useState } from "react";

import Navbar from "../Components/NavBar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Leaderboard(){
  const students = [
    {
      username: "Noobmaster",
      scores: [22, 22, 22, 22, 22, 22],
      time: "1:15:00",
    },
    { username: "Posidon", scores: [15, 4, 7, 10, 25, 22], time: "1:15:00" },
    {
      username: "SkullCrusher",
      scores: [2, 14, 15, 2, 21, 20],
      time: "1:15:00",
    },
    {
      username: "ElvishBhai",
      scores: [22, 22, 22, 22, 22, 22],
      time: "1:15:00",
    },
    { username: "IronFist", scores: [12, 18, 20, 15, 22, 10], time: "1:15:00" },
    {
      username: "DarkKnight",
      scores: [10, 9, 14, 20, 22, 17],
      time: "1:15:00",
    },
    {
      username: "ShadowHunter",
      scores: [18, 12, 16, 20, 14, 19],
      time: "1:15:00",
    },
    {
      username: "CyberNinja",
      scores: [22, 5, 13, 8, 17, 21],
      time: "1:15:00",
    },
    {
      username: "Phantom",
      scores: [9, 14, 20, 11, 15, 18],
      time: "1:15:00",
    },
    {
      username: "StormBreaker",
      scores: [19, 22, 16, 12, 20, 14],
      time: "1:15:00",
    },
    {
      username: "BlazeRider",
      scores: [8, 10, 22, 19, 13, 16],
      time: "1:15:00",
    },
    {
      username: "Ashmit B",
      scores: [80, 100, 220, 19, 13, 16],
      time: "1:15:00",
    },
  ];

  // calculate total score
  const dataWithScores = students.map((s) => ({
    ...s,
    total: s.scores.reduce((a, b) => a + b, 0),
  }));

  // sort by score descending
  const sortedData = [...dataWithScores].sort((a, b) => b.total - a.total);

  // pagination
  const itemsPerPage = 4;
  const [page, setPage] = useState(0);
  const startIndex = page * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  return (
    <>
      <div className="orbitron h-[100vh] w-[100vw] bg-gradient-to-b from-[#2A2255] to-[#0C091F] box-border overflow-x-hidden ">
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
                <th className="w-[7%]">Q5</th>
                <th className="w-[7%]">Q6</th>
                <th className="w-[13%]">TIME</th>
                <th className="w-[13%]">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((student, idx) => (
                <tr
                  key={student.username}
                  className="text-md hover:scale-102 hover:shadow-xl duration-400"
                >
                  <td className="py-[2.3%]">{startIndex + idx + 1}</td>
                  <td className="font-bold">
                    {student.username.toUpperCase()}
                  </td>
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
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className={`w-10 h-10 flex items-center justify-center rounded-[5px] border-[1px] border-[#6435DD]  ${
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
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              className={`w-10 h-10 flex items-center justify-center rounded-[5px] border-[1px] border-[#6435DD]  ${
                page === totalPages - 1
                  ? "bg-[#1B0E3B] text-[#3D257A] cursor-not-allowed"
                  : "bg-[#6435DD] text-white hover:bg-[#7162e0] cursor-pointer hover:shadow-2xl hover:scale-105 "
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
