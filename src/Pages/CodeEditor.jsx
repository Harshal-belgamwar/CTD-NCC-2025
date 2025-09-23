// src/components/CodeEditor.js
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useLocation , useNavigate} from "react-router-dom";
import { io } from "socket.io-client";

const BACKEND_URL = "http://localhost:3000";

function encodeBase64(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

const CodeEditor = () => {
  const languages = ["cpp", "java", "python"];
  const [language, setLanguage] = useState("python");
  const [question, setQuestion] = useState({});
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");

  const [submissionId, setSubmissionId] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitSubmissionId, setSubmitSubmissionId] = useState(0);

  const leftColRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState("500px");

  const location = useLocation();
  const questionIndex = location.state?.questionIndex;

  const navigate = useNavigate();

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
  };

  // Fetch question
  useEffect(() => {
    if (!questionIndex) return;
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/problems/${questionIndex}`,
          { withCredentials: true }
        );
        setQuestion(res.data);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    };
    fetchQuestion();
  }, [questionIndex]);

  // Set default code when language changes
  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  // Load saved code
  useEffect(() => {
    if (!question?.id) return;
    const saved = localStorage.getItem(`code_q${question.id}_${language}`);
    if (saved) setCode(saved);
    else setCode(defaultCode[language]);
  }, [question, language]);

  // Auto-save code
  useEffect(() => {
    if (!question?.id) return;
    const timer = setTimeout(() => {
      localStorage.setItem(`code_q${question.id}_${language}`, code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, question, language]);

  // Adjust editor height
  useEffect(() => {
    const updateHeight = () => {
      if (leftColRef.current)
        setEditorHeight(`${leftColRef.current.clientHeight}px`);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Initialize Socket.IO
  useEffect(() => {
    if (!submissionId) return;

    const socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
      socket.emit("subscribe", submissionId);
    });

    socket.on("result", (data) => {
      if (data.user_output) setOutput(data.user_output);
      else if (data.status === "runtime_error")
        setOutput("Runtime Error:\n" + data.stderr);
      else if (data.compile_output)
        setOutput("Compilation Error:\n" + data.compile_output);
      else setOutput("No output received.");
    });

    return () => socket.disconnect();
  }, [submissionId]);

  //submission useeffect
  useEffect(() => {
    if (!submitSubmissionId) return;

    const socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to submission socket:", socket.id);
      socket.emit("subscribe", submitSubmissionId); // join room
    });

    socket.on("result", (data) => {
      const parsedData = {
        status: data.status || "unknown",
        message: data.message || "",
        failed_test_case: parseInt(data.failed_test_case ?? "0", 10),
        total_test_case: parseInt(data.total_test_case ?? "0", 10),
        score: parseInt(data.score ?? "0", 10),
      };
      console.log("Submission result received:", parsedData);
      setSubmitResult(parsedData); // contains array of test cases, score, status
    });

    return () => socket.disconnect();
  }, [submitSubmissionId]);

  // Run code
  const runCode = async () => {
    setOutput(null);
    setSubmitResult(null);

    const payload = {
      code: encodeBase64(code),
      customTestcase: encodeBase64(customInput),
      language,
      problem_id: question?.id || 1,
      event_id: 1,
    };

    try {
      const res = await axios.post(`${BACKEND_URL}/submission/run`, payload, {
        withCredentials: true,
      });
      const data = res.data;
      if (data.submission_id) setSubmissionId(data.submission_id);
    } catch (err) {
      setOutput("Error: " + (err.response?.data?.message || err.message));
    }
  };

  // Submit code
  const submitCode = async () => {
    setSubmitResult(null);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/submission/submit`,
        {
          code: encodeBase64(code),
          language,
          problem_id: question?.id || 1,
          event_id: 1,
        },
        { withCredentials: true }
      );

      
      console.log(res.error);

      // Save submission_id to trigger useEffect
      setSubmitSubmissionId(res.data.submission_id);
    } catch (err) {

      if(err.response.status === 403){
        navigate("/results");
      }

      console.error("Submission error:", err);
      setSubmitResult({
        status: "error",
        message: err,
      });
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#2A2255] to-[#0C091F] p-4 sm:p-6">
      <nav>
        <Navbar />
      </nav>

      <div className="orbitron text-white mt-8 flex justify-end pr-[5%]">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#6435DD] w-[25%] sm:w-[20%] md:w-[15%] lg:w-[12%] h-[40px] sm:h-[46px] text-center border-2 border-[#6435DD] text-white text-sm sm:text-base rounded-md shadow-md hover:bg-[#5a2fd4] transition-colors duration-300"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang} className="bg-[#2A2255] text-white">
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6 p-4">
        {/* Left column */}
        <div
          className="w-full lg:w-1/2 h-full flex flex-col overflow-y-auto p-6 bg-[#0C091F]/40 rounded-lg shadow-md"
          ref={leftColRef}
        >
          <h2 className="orbitron text-xl sm:text-2xl md:text-3xl text-white font-bold">
            {question?.title || "Sample Problem Title"}
          </h2>
          <p className="orbitron mt-3 text-lg font-semibold sm:text-base md:text-base text-white">
            Score: {question?.score || 0}
          </p>
          <p className="oxanium mt-5 text-base sm:text-lg text-white leading-relaxed">
            {question?.description || "Sample Problem Description"}
          </p>

          {/* Input / Output / Constraints */}
          <div className="mt-4 text-base sm:text-base space-y-2 oxanium">
            <p className="text-white mt-4 font-semibold">Input Format:</p>
            <p className="text-white ml-2">
              {question?.input_format || "sample input format"}
            </p>
            <p className="text-white mt-4 font-semibold">Output Format:</p>
            <p className="text-white ml-2">
              {question?.output_format || "sample output format"}
            </p>
            <p className="text-white mt-4 font-semibold">Constraints:</p>
            <p className="text-white ml-2">
              {question?.constraints || "sample constraints"}
            </p>
          </div>

          {/* Test Cases */}
          <div className="oxanium mt-8 text-base sm:text-base text-white font-semibold">
            Test Cases
            <div className="w-full mt-3 space-y-4">
              {question?.samples?.map((tc, index) => (
                <div
                  key={index}
                  className="p-4 border border-[#6435DD] rounded-md bg-[#2A2255]/30"
                >
                  <p>
                    <strong>Input:</strong>
                    <pre className="text-white">
                      {tc.input.replace(/\\n/g, "\n")}
                    </pre>
                  </p>
                  <p>
                    <strong>Output:</strong>
                    <pre className="text-white">
                      {tc.output.replace(/\\n/g, "\n")}
                    </pre>
                  </p>
                  <p>
                    <strong>Explanation:</strong>
                    <pre className="text-white">
                      {tc.explanation.replace(/\\n/g, "\n")}
                    </pre>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Code editor */}
          <div
            className="w-full border border-[#6435DD] flex flex-col bg-[#2A0E5E] rounded-lg shadow-md"
            style={{ height: editorHeight }}
          >
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 15,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: false,
                quickSuggestions: false,
              }}
              onMount={(editor, monaco) => {
                monaco.editor.defineTheme("blue-theme", {
                  base: "vs-dark",
                  inherit: true,
                  rules: [
                    { token: "", background: "001F3F", foreground: "FFFFFF" },
                    { token: "keyword", foreground: "FFD700" },
                    { token: "string", foreground: "00FF00" },
                    { token: "number", foreground: "1E90FF" },
                    {
                      token: "comment",
                      foreground: "AAAAAA",
                      fontStyle: "italic",
                    },
                  ],
                  colors: {
                    "editor.background": "#0C091F66",
                    "editor.foreground": "#FFFFFF",
                    "editorCursor.foreground": "#FF4136",
                    "editor.lineHighlightBackground": "#003366",
                    "editorLineNumber.foreground": "#7FDBFF",
                    "editor.selectionBackground": "#0074D9",
                  },
                });
                monaco.editor.setTheme("blue-theme");
                editor.addCommand(monaco.KeyCode.Tab, () => {});
              }}
              theme="blue-theme"
            />
          </div>

          {/* Custom input */}
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input..."
            className="w-full h-[120px] p-3 bg-[#0C091F66]/40 text-white rounded-lg resize-none focus:outline-none border border-[#6435DD]"
          />

          {/* Output */}
          <div className="w-full h-[120px] text-white orbitron text-sm sm:text-base md:text-lg p-4 overflow-y-auto bg-[#0C091F66]/40 rounded-lg border border-[#6435DD]">
            <div>Output: </div>
            <pre>{output === null ? "Running..." : output}</pre>
          </div>

          {/* Submit Results */}
          {submitResult && (
            <div className=" oxanium mt-4 p-4 border border-[#6435DD] rounded-md bg-[#2A2255]/30 text-white">
              <p className="font-bold mb-2">
                Status:{" "}
                <span
                  className={
                    submitResult.status?.toLowerCase() === "accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {submitResult.status}
                </span>{" "}
                | Score: {submitResult.score ?? 0}
              </p>
              <p className="mb-3">
                {submitResult.failed_test_case === 0
                  ? `All ${submitResult.total_test_case} test cases passed`
                  : `${submitResult.failed_test_case - 1} / ${
                      submitResult.total_test_case
                    } test cases passed`}
              </p>
              <div className="space-y-2">
                {Array.from({ length: submitResult.total_test_case }).map(
                  (_, idx) => {
                    let statusClass = "text-white";
                    let text = `Test Case ${idx + 1}`;

                    if (
                      submitResult.failed_test_case === 0 ||
                      idx + 1 < submitResult.failed_test_case
                    ) {
                      statusClass = "text-green-400";
                      text += ": PASSED";
                    } else if (idx + 1 === submitResult.failed_test_case) {
                      statusClass = "text-red-500";
                      text += ": FAILED";
                    }

                    return (
                      <div
                        key={idx + 1}
                        className="p-2 border border-[#6435DD] rounded-md"
                      >
                        <p className={statusClass}>{text}</p>
                        {/* {idx+1 === submitResult.failed_test_case &&
                          submitResult.message && (
                            <p className="text-red-400 text-sm">
                              Error: {submitResult.message}
                            </p>
                          )} */}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-2 flex gap-3 justify-end text-white font-bold text-xl">
            <button
              onClick={runCode}
              className="w-[150px] h-[50px] bg-[#6435DD] border-2 border-[#6435DD] rounded-md hover:bg-[#361D77] transition-colors shadow-md"
            >
              Run
            </button>
            <button
              onClick={submitCode}
              className="w-[150px] h-[50px] bg-[#6435DD] border-2 border-[#6435DD] rounded-md hover:bg-[#361D77] transition-colors shadow-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
