const Navbar = () => {
  return (
    // <div className="bg-gradient-to-b from-[#6453DD] to-[#361D77] p-[2px] rounded-[10px]">
    <div className="orbitron mt-4 w-full max-w-6xl mx-auto bg-gradient-to-b from-[#6453DD] to-[#361D77] p-[2px] rounded-[10px]">
      {/* <div className="mt-4 w-[90%] sm:w-[85%] md:w-[80%] h-auto md:h-[8%] bg-[#2A2255] rounded-[10px] mx-auto flex flex-col md:flex-row justify-between items-center tracking-wide p-3 md:p-0 gap-3 md:gap-0"> */}
      <div className="w-full h-full bg-[#2A2255] rounded-[8px] flex flex-col md:flex-row justify-between items-center tracking-wide gap-3">
        {/* Logo */}
        <div className="text-xl sm:text-2xl md:text-4xl text-center  font-bold text-[#FFFFFF] leading-[100%] ml-5">
          NCC
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center md:justify-evenly gap-4 md:gap-12  items-center">
          <a
            href="/instructions"
            className="text-sm sm:text-base md:text-lg text-center font-bold text-[#FFFFFF] leading-[100%]"
          >
            INSTRUCTIONS
          </a>
          <a
            href="/question-hub"
            className="text-sm sm:text-base md:text-lg text-center font-bold text-[#FFFFFF] leading-[100%]"
          >
            QUESTION HUB
          </a>
          <a
            href="/leaderboard"
            className="text-sm sm:text-base md:text-lg text-center font-bold text-[#FFFFFF] leading-[100%]"
          >
            LEADERBOARDS
          </a>
          <a
            href="/results"
            className="text-sm sm:text-base md:text-lg text-center font-bold text-[#FFFFFF] leading-[100%]"
          >
            RESULTS
          </a>
        </div>

        {/* Button */}
        <div className="p-1 md:p-2">
          <button className="bg-[#6453DD] border-[2px] border-[#6435DD]  px-3 py-2 sm:px-4 sm:py-2 md:p-4 rounded-[5px] text-[0.7rem] sm:text-sm md:text-md text-center font-bold text-[#FFFFFF] leading-[100%] hover:bg-transparent cursor-pointer duration-200">
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
