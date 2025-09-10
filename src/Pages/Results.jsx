import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/NavBar";
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
    // Example API call (replace with your backend API URL)
    axios
      .get("http://localhost:5000/api/result")
      .then((res) => {
        // Assuming response looks like:
        // {
        //   name: "Ashmit",
        //   level: "Junior",
        //   rank: 1,
        //   score: 100,
        //   totalSubmissions: 5,
        //   accuracy: 80.0
        // }
        setResult(res.data);
      })
      .catch((err) => {
        console.error("Error fetching result:", err);
      });
  }, []);
  return (
    <>
      <div className="orbitron h-[100vh] w-[100vw] bg-gradient-to-b from-[#2A2255] to-[#0C091F] box-border overflow-x-hidden ">
        <nav>
          <Navbar />
        </nav>

        <div className="mt-[2.1%] w-full text-center font-bold text-5xl text-[#FFFFFF] mx-auto tracking-wide">
          RESULT
        </div>

        <div className="h-fit w-full mt-[5.5%] flex flex-row justify-center items-center">
          {/* left part */}
          <div className="h-full w-[50%] flex flex-col justify-center items-center gap-15">
            <img src={alien} alt="" className="w-[20%] h-[20%]" />
            <div className="font-bold text-4xl text-center text-[#FFFFFF]">
              {result.name || "Loading Name..."}
            </div>
            <div className="px-5 py-3 rounded-lg bg-[#6453DD] flex justify-center items-center">
              <div className="font-bold text-3xl text-[#FFFFFF] text-center ">
                {result.level || "Unknown"}
              </div>
            </div>
          </div>

          {/* right part */}
          <div className=" h-full w-[50%] grid grid-cols-2 gap-y-[60%] items-end justify-center ">
            {/* rank */}
            <div className="w-[75%] h-[190%] rounded-[8px] border-[3px] border-[#6453DD] flex flex-col">
              <div className="h-[65%] rounded-b-[15px] border-[2px] bg-[#6453DD] border-[#6453DD] flex items-center justify-center">
                <div className="font-bold text-7xl text-center text-[#FFFFFF] ">
                  {result.rank}
                </div>
              </div>
              <div className="h-[35%] flex items-center justify-center">
                <div className="font-bold text-3xl text-center text-[#FFFFFF]">
                  RANK
                </div>
              </div>
            </div>

            {/* score */}
            <div className="w-[75%] h-[190%] rounded-[8px] border-[3px] border-[#6453DD] flex flex-col">
              <div className="h-[65%] rounded-b-[15px] border-[2px] bg-[#6453DD] border-[#6453DD] flex items-center justify-center">
                <div className="font-bold text-7xl text-center text-[#FFFFFF] ">
                  {result.score}
                </div>
              </div>
              <div className="h-[35%] flex items-center justify-center">
                <div className="font-bold text-3xl text-center text-[#FFFFFF]">
                  SCORE
                </div>
              </div>
            </div>

            {/* total submissions */}
            <div className="w-[75%] h-[190%] rounded-[8px] border-[3px] border-[#6453DD] flex flex-col">
              <div className="h-[65%] rounded-b-[15px] border-[2px] bg-[#6453DD] border-[#6453DD] flex items-center justify-center">
                <div className="font-bold text-7xl text-center text-[#FFFFFF] ">
                  {result.totalSubmissions}
                </div>
              </div>
              <div className="h-[35%] flex items-center justify-center">
                <div className="font-bold text-xl text-center text-[#FFFFFF]">
                  TOTAL SUBMISSIONS
                </div>
              </div>
            </div>

            {/* accuracy */}
            <div className="w-[75%] h-[190%] rounded-[8px] border-[3px] border-[#6453DD] flex flex-col">
              <div className="h-[65%] rounded-b-[15px] border-[2px] bg-[#6453DD] border-[#6453DD] flex items-center justify-center">
                <div className="font-bold text-6xl text-center text-[#FFFFFF] ">
                  {result.accuracy || "100%"}
                </div>
              </div>
              <div className="h-[35%] flex items-center justify-center">
                <div className="font-bold text-3xl text-center text-[#FFFFFF]">
                  ACCURACY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Results;
