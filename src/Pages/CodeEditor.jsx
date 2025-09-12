import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

import Navbar from "../components/NavBar";



import axios from "axios";

const CodeEditor = () => {
  const languages = ["cpp", "java", "python", "javascript"];
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  // Judge0 language mapping
  const languageMap = {
    cpp: 54,
    java: 62,
    python: 71,
    javascript: 63,
  };

  // Default code snippets
  const defaultCode = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    python: `print("Hello, World!")`,
    javascript: `console.log("Hello, World!");`,
  };

  // Load default code on language change
  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const runCode = async () => {
    setOutput("⏳ Running...");

    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id: languageMap[language],
          stdin: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key":
              "d4d3db8e2bmshc2898021d95daabp11538ejsncbd0eb9a8c69", // replace with your own key
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const result = response.data;

      if (result.stdout) setOutput(result.stdout);
      else if (result.stderr) setOutput("❌ Runtime Error:\n" + result.stderr);
      else if (result.compile_output)
        setOutput("⚠️ Compilation Error:\n" + result.compile_output);
      else setOutput("⚠️ No output received.");
    } catch (err) {
      setOutput("🚨 Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#2A2255] to-[#0C091F] p-4 sm:p-6">
      {/* Navbar */}
      <nav>
        <Navbar />
      </nav>

      {/* Language selector */}
      <div className="orbitron text-white mt-8 flex justify-end pr-[5%]">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#6435DD] w-[25%] sm:w-[20%] md:w-[15%] lg:w-[12%] 
                     h-[40px] sm:h-[46px] text-center border-2 border-[#6435DD] 
                     text-white text-sm sm:text-base rounded-md shadow-md 
                     hover:bg-[#5a2fd4] transition-colors duration-300"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang} className="bg-[#2A2255] text-white">
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Question + Code Editor */}
      <div className="w-full flex flex-col lg:flex-row gap-6 p-4 ">
        {/* Question & test cases */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-6 bg-[#0C091F]/40 rounded-lg shadow-md">
          <h2 className="orbitron text-2xl sm:text-3xl md:text-4xl text-white font-bold">
            5. Question Name
          </h2>
          <p className="orbitron mt-3 text-base sm:text-lg md:text-xl text-[#D1C4FF]">
            Points: 149
          </p>

          <p className="oxanium mt-5 text-base sm:text-lg text-white leading-relaxed">
            Leland Tyler Wayne (born September 16, 1993), known professionally
            as Metro Boomin, is an American RECORD Producer. Critically acclaimed
            for his dark production style...
          </p>

          <div className="orbitron mt-8 text-lg sm:text-xl text-[#AFA2FF] font-semibold">
            Test Cases
          </div>
          <div>

            
          </div>
        </div>

        {/* Code Editor + Output */}
        <div className="w-full lg:w-1/2 h-[70vh] border border-[#6435DD] flex flex-col bg-[#6435DD14] rounded-lg shadow-md">
          {/* Monaco Editor */}
          <Editor
            height="50%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 13,
              fontFamily: "Fira Code, monospace",
              minimap: { enabled: false },
              tabSize: 0,
              insertSpaces: false,
              detectIndentation: false,
              quickSuggestions: false,
            }}
            onMount={(editor, monaco) => {
              editor.addCommand(monaco.KeyCode.Tab, () => {});
            }}
          />

          {/* Output */}
          <div className="text-white orbitron text-sm sm:text-base md:text-lg p-4 h-[50%] overflow-y-auto bg-[#0C091F]/60 rounded-b-lg">
            <strong className="text-[#D1C4FF]">Output:</strong>
            <pre className="mt-2">{output}</pre>
          </div>
        </div>
      </div>

      {/* Run & Submit buttons */}
      <div className="mt-10 flex gap-5 sm:gap-8 w-full text-white orbitron text-base sm:text-lg md:text-xl justify-center lg:justify-end">
        <button
          onClick={runCode}
          className="w-[100px] sm:w-[130px] md:w-[150px] h-[40px] sm:h-[45px] md:h-[50px] 
                     bg-[#6435DD] border-2 border-[#6435DD] rounded-md 
                     hover:bg-[#361D77] transition-colors shadow-md"
        >
          Run
        </button>
        <button
          className="w-[100px] sm:w-[130px] md:w-[150px] h-[40px] sm:h-[45px] md:h-[50px] 
                     bg-[#6435DD] border-2 border-[#6435DD] rounded-md 
                     hover:bg-[#361D77] transition-colors shadow-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
