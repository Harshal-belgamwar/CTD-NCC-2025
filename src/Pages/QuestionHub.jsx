import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

const QuestionHub = () => {
  const [accuracy, setAccuracy] = useState([]);

  const navigate = useNavigate();

  //fetch questions from backend
  useEffect(() => {
    const getQuestions = async () => {
      const response = await axios.get(
        `${API_URL}/problems/accuracy`,
        {
          withCredentials: true,
        }
      );
      setAccuracy(response.data);
    };
    getQuestions();
  }, []);

  //mapping to code editor
  const handleQuestionClick = (problem_id) => {
    navigate("/codeeditor", { state: { problem_id } });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#2A2255] to-[#0C091F] flex flex-col">
      {/* Navbar */}
      <nav>
        <Navbar />
      </nav>

      {/* Heading */}
      <div className="mt-[2rem] orbitron text-white text-[1.75rem] sm:text-[2.5rem] md:text-[3rem] text-center">
        <h1>QUESTION HUB</h1>
      </div>

      {/* Question Grid */}
      <div className="w-10/12 max-w-[70rem] mx-auto mt-[5rem] grid grid-cols-4 gap-[3rem] sm:gap-[4rem] p-1 mb-10">
        {Array.from({ length: 4 }).map((_, index) => {
          const accString  = accuracy[index]?.accuracy || "0%";
          const acc= Math.round(parseFloat(accString.replace("%", "")));
          const fillPercent = acc/100;

          return (
            <div
              key={index}
              className="p-[0.05rem] rounded-md transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
              onClick={() => handleQuestionClick(accuracy[index]?.problem_id)}
            >
              {/* Outer Box */}
              <div className="w-full aspect-square bg-[#0C091F] relative rounded-md border border-[#6435DD] overflow-hidden">
                {/* Purple Fill */}
                <div
                  className="absolute bottom-0 left-0 w-full bg-[#6435DD] opacity-50 transition-all duration-500"
                  style={{ height: `${fillPercent * 100}%` }}
                ></div>

                {/* Question Number */}
                <div className="absolute inset-0 flex justify-center items-center text-white orbitron text-[1rem] sm:text-[1.5rem] md:text-[2.25rem] z-10">
                  {`Q${index + 1}`}
                </div>
              </div>

              {/* Accuracy Text */}
              <div className="mt-2 text-center">
                <span className="text-sm sm:text-xl font-bold orbitron bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 drop-shadow-lg">
                  Accuracy: {acc}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionHub;
