import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import FullscreenMonitor from "./FullscreenMonitor";

const instructionsData = [
  {
    number: "01",
    text: "Participants are allowed only one login session. Multiple logins are not permitted.",
  },
  {
    number: "02",
    text: "The contest will run from 6 PM to 7:30 PM, lasting for a duration of 1.5 hours.",
  },
  {
    number: "03",
    text: "All questions are available in the Question Hub. Additionally, the correct submission percentage of all the participants for each question is displayed.",
  },
];

const InstructionItem = ({ number, text }) => {
  
  return (
    <div className="w-[65%] h-[40%] bg-gradient-to-r from-[#6435DD] to-[#361D77] p-[2px] rounded-[5px] mx-auto">
      <div className="flex items-center gap-6 w-full h-full rounded-[5px] bg-[#1E193B]">
        <div className="flex-shrink-0 w-18 h-18 flex items-center justify-center bg-[#6435DD] min-h-[110px] min-w-[120px]">
          <p className="text-white font-bold text-3xl">{number}</p>
        </div>
        <p className="text-white px-5 text-lg">{text}</p>
      </div>
    </div>
  );
};

const Instructions = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
   
    navigate("/question-hub");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2A2255] to-[#0C091F] items-center justify-center tracking-wider">
      <Navbar />
      <div className="flex flex-col flex-grow items-center justify-center space-y-4">
        <h1 className="text-white text-5xl font-bold tracking-wide py-4">
          INSTRUCTIONS
        </h1>
        <div className="w-full mx-auto space-y-5">
          {instructionsData.map((item) => (
            <InstructionItem
              key={item.number}
              number={item.number}
              text={item.text}
            />
          ))}
        </div>
        <button
          className="text-white font-bold bg-[#6435DD] border-[2px] border-[#6435DD] mt-6 py-3 px-15 rounded-[5px] hover:bg-[#0C091F] transition-colors tracking-widest cursor-pointer duration-300"
          onClick={handleProceed}
        >
          PROCEED
        </button>
      </div>
    </div>
  );
};

export default Instructions;
