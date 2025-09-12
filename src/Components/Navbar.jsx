import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="orbitron mt-4 w-full max-w-6xl mx-auto bg-gradient-to-b from-[#6453DD] to-[#361D77] p-[2px] rounded-[10px]">
      <div className="w-full h-full bg-[#2A2255] rounded-[8px] flex flex-col md:flex-row justify-between items-center tracking-wide gap-3">
        {/* Logo */}
        <div className="text-xl sm:text-2xl md:text-4xl text-center font-bold text-[#FFFFFF] leading-[100%] ml-5">
          NCC
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center md:justify-evenly gap-4 md:gap-12 items-center">
          <NavLink
            to="/instructions"
            className={({ isActive }) =>
              `text-sm sm:text-base md:text-lg text-center font-bold leading-[100%] duration-200 ${
                isActive
                  ? "text-violet-400" // Active link
                  : "text-white hover:text-violet-300"
              }`
            }
          >
            INSTRUCTIONS
          </NavLink>

          <NavLink
            to="/question-hub"
            className={({ isActive }) =>
              `text-sm sm:text-base md:text-lg text-center font-bold leading-[100%] duration-200 ${
                isActive ? "text-violet-400" : "text-white hover:text-violet-300"
              }`
            }
          >
            QUESTION HUB
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `text-sm sm:text-base md:text-lg text-center font-bold leading-[100%] duration-200 ${
                isActive ? "text-violet-400" : "text-white hover:text-violet-300"
              }`
            }
          >
            LEADERBOARDS
          </NavLink>

          <NavLink
            to="/results"
            className={({ isActive }) =>
              `text-sm sm:text-base md:text-lg text-center font-bold leading-[100%] duration-200 ${
                isActive ? "text-violet-400" : "text-white hover:text-violet-300"
              }`
            }
          >
            RESULTS
          </NavLink>
        </div>

        {/* Button */}
        <div className="p-1 md:p-2">
          <button className="bg-[#6453DD] border-[2px] border-[#6435DD] px-3 py-2 sm:px-4 sm:py-2 md:p-4 rounded-[5px] text-[0.7rem] sm:text-sm md:text-md text-center font-bold text-white leading-[100%] hover:bg-transparent hover:text-violet-300 cursor-pointer duration-200">
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
