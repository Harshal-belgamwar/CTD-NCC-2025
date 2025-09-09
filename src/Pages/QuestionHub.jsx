import React from 'react';
import Navbar from '../Components/NavBar';

const QuestionHub = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#2A2255] to-[#0C091F] flex flex-col">
      <nav>
        <Navbar />
      </nav>

      {/* Heading (smaller size) */}
      <div className="relative mt-10 orbitron text-white text-2xl sm:text-3xl md:text-4xl text-center">
        QUESTION HUB
      </div>

      {/* Question Grid (smaller boxes) */}
      <div className="w-full max-w-5xl mx-auto mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 p-4">
        
        {/* Q1 */}
        <div className="p-[2px] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-lg">
          <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-xl sm:text-2xl md:text-3xl bg-[#0C091F] rounded-lg">
            Q1
          </div>
        </div>

        {/* Q2 */}
        <div className="p-[2px] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-lg">
          <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-xl sm:text-2xl md:text-3xl bg-[#0C091F] rounded-lg">
            Q2
          </div>
        </div>

        {/* Q3 */}
        <div className="p-[2px] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-lg">
          <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-xl sm:text-2xl md:text-3xl bg-[#0C091F] rounded-lg">
            Q3
          </div>
        </div>

        {/* Q4 */}
        <div className="p-[2px] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-lg">
          <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-xl sm:text-2xl md:text-3xl bg-[#0C091F] rounded-lg">
            Q4
          </div>
        </div>

        {/* Q5 */}
        <div className="p-[2px] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-lg">
          <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-xl sm:text-2xl md:text-3xl bg-[#0C091F] rounded-lg">
            Q5
          </div>
        </div>

        {/* Q6 */}
        <div className="p-[2px] bg-gradient-to-b from-[#6435DD] to-[#361D77] rounded-lg">
          <div className="w-full aspect-square flex justify-center items-center text-white orbitron text-xl sm:text-2xl md:text-3xl bg-[#0C091F] rounded-lg">
            Q6
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionHub;
