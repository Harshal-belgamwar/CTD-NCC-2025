import Navbar from "../Components/Navbar";

const QuestionHub = () => {
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
      <div className="w-10/12 max-w-[60rem] mx-auto mt-[1.5rem] grid grid-cols-2 sm:grid-cols-3 gap-[3rem] sm:gap-[4rem] p-1 mb-10">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="p-[0.05rem] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-md 
                 transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-[1rem] sm:text-[1.5rem] md:text-[2.25rem] bg-[#0C091F] rounded-md">
              Q{i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionHub;
