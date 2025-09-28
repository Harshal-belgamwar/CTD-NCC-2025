// src/components/CodeEditor.js
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import file from "../assets/file.svg";
import { io } from "socket.io-client";
import SubmitCodeBox from "./SubmitCodeBox";


const API_URL = import.meta.env.VITE_API_URL;

const BACKEND_URL = `${API_URL}`;

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

  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
 

  const [code, setCode] = useState("");
  const [submissionId, setSubmissionId] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitSubmissionId, setSubmitSubmissionId] = useState(null);

  const [userSubmissions, setUserSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const leftColRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState("500px");

  const location = useLocation();
  const questionIndex = location.state?.problem_id;

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

  //fetch submissions

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
      if (data.user_output) {
        setOutput(data.user_output);
      } else {
        console.log("data:", data);
        setOutput(`${data.status} : ${data.message}`);
      }
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
      setSubmitSubmissionId(null);
      const parsedData = {
        status: data.status || "unknown",
        message: data.message || "",
        failed_test_case: parseInt(data.failed_test_case ?? "0", 10),
        total_test_case: parseInt(data.total_test_case ?? "0", 10),
        score: parseInt(data.score ?? "0", 10),
      };
      console.log("Submission result received:", parsedData);
      setSubmitResult(parsedData); // contains array of test cases, score, status
      if (
        parsedData.status === "accepted" &&
        !localStorage.getItem(`solved_${questionIndex}`)
      ) {
        localStorage.setItem(`solved_${questionIndex}`, "solved");
      }
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
      if (data.submission_id) setSubmissionId(res.data.submission_id);
      setTimeout(() => setSubmissionId(null), 5000);
    } catch (err) {
      setSubmissionId(null)
      if (err.response.status === 403) {
        navigate("/results");
      }
      setOutput("Error: " + (err.response?.data?.message || err.message));
    }
  };

  

  // Submit code
  const submitCode = async () => {
    setSubmissionId(null);
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
      setTimeout(() => setSubmitSubmissionId(null), 5000);
    } catch (err) {
      setSubmitSubmissionId(null)
      if (err.response.status === 403) {
        navigate("/results");
      }

      console.error("Submission error:", err);
      setSubmitResult({
        status: "error",
        message: err,
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/gethistory`, {
        withCredentials: true,
      });

      const filterData = res.data.filter(
        (submission) => submission.problem_id === questionIndex
      );
      console.log("User submissions:", filterData);
      setUserSubmissions(filterData);
    } catch (err) {
      console.error("Error fetching submissions:", err);
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

      {/* description and submission */}
      <div className="w-full lg:w-1/2 flex flex-row gap-3 h-[30%] border border-[#2A2255] mt-5 p-4 text-white">
        <div
          className={`w-[20%] h-full flex justify-center items-center cursor-pointer p-3 rounded-lg transition-all duration-300
      ${
        activeTab === "description"
          ? "bg-[#6435DD] border-2 border-[#6435DD] text-white"
          : "bg-[#2A2255] text-gray-300 hover:bg-[#392d72]"
      }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </div>

        <div
          className={`w-[30%] h-full flex justify-center items-center cursor-pointer p-3 rounded-lg transition-all duration-300
      ${
        activeTab === "submissions"
          ? "bg-[#6435DD] border-2 border-[#6435DD] text-white"
          : "bg-[#2A2255] text-gray-300 hover:bg-[#392d72]"
      }`}
          onClick={() => {
            setActiveTab("submissions");
            fetchSubmissions();
          }}
        >
          Submissions
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6 p-4 ">
        {/* Left column */}
        <div
          className="w-full lg:w-1/2  flex flex-col overflow-y-auto p-6 bg-[#0C091F]/40 rounded-lg shadow-md h-fit"
          ref={leftColRef}
        >
          {/* // Description Tab */}
          {activeTab === "description" && (
            <>
              <div className="flex justify-between">
                <h2 className="orbitron text-xl sm:text-2xl md:text-3xl text-white font-bold">
                  {question?.title || "Sample Problem Title"}
                </h2>
                {localStorage.getItem(`solved_${questionIndex}`) ===
                  "solved" && (
                  <div>
                    <img
                      src={file}
                      alt="Solved"
                      className=" w-8 h-8 mb-2 rounded-full "
                    />
                  </div>
                )}
              </div>

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
                      className="p-4 border border-[#6435DD] rounded-md bg-[#2A2255]/30 space-y-2"
                    >
                      <div>
                        <strong>Input:</strong>
                        <pre className="text-white whitespace-pre-wrap break-words">
                          {tc.input.replace(/\\n/g, "\n")}
                        </pre>
                      </div>
                      <div>
                        <strong>Output:</strong>
                        <pre className="text-white whitespace-pre-wrap break-words">
                          {tc.output.replace(/\\n/g, "\n")}
                        </pre>
                      </div>
                      <div>
                        <strong>Explanation:</strong>
                        <pre className="text-white whitespace-pre-wrap break-words">
                          {tc.explanation.replace(/\\n/g, "\n")}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Submissions
              </h3>

              <div className="space-y-3">
                {userSubmissions.length > 0 ? (
                  userSubmissions.map((submission, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedCode(submission.code)}
                      className="bg-white dark:bg-[#0C091F]/40 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Language Badge */}
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {submission.language}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              submission.result
                                .toLowerCase()
                                .includes("pass") ||
                              submission.result
                                .toLowerCase()
                                .includes("accepted") ||
                              submission.result
                                .toLowerCase()
                                .includes("success")
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : submission.result
                                    .toLowerCase()
                                    .includes("fail") ||
                                  submission.result
                                    .toLowerCase()
                                    .includes("reject") ||
                                  submission.result
                                    .toLowerCase()
                                    .includes("error")
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            Status: {submission.result}
                          </span>
                        </div>

                        {/* Timestamp */}
                        <div className="oxanium flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(submission.submitted_at).toLocaleTimeString(
                            [],
                            { hour12: false }
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400 text-lg">
                      No submissions yet.
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Your code submissions will appear here once you start
                      solving problems.
                    </p>
                  </div>
                )}
              </div>
              {selectedCode && (
                <SubmitCodeBox
                  question={{ code: selectedCode }} // pass code as question object
                  onClose={() => setSelectedCode(null)} // close box
                />
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {/* Code editor */}
          <div
            className=" w-full border border-[#6435DD] flex flex-col bg-[#2A0E5E] rounded-lg shadow-md"
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
                contextmenu: false,
              }}
              onMount={(editor, monaco) => {
                // Define theme
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

                // Disable Tab key default behavior
                editor.addCommand(monaco.KeyCode.Tab, () => {
                  editor.trigger("keyboard", "type", { text: "  " });
                });
              }}
              theme="blue-theme"
            />
          </div>

          {/* Custom input */}
          <div className="space-y-4">
            {submitResult ? (
              // Submission Results Block
              <div className="oxanium mt-4 p-4 border border-[#6435DD] rounded-md bg-[#2A2255]/30 text-white">
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
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              // Custom/Test Case Input with Output
              <>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input..."
                  className="w-full h-[120px] p-3 bg-[#0C091F66]/40 text-white rounded-lg resize-none focus:outline-none border border-[#6435DD]"
                />

                {/* Output */}
                <div className="w-full h-[120px] text-white orbitron text-sm sm:text-base md:text-lg p-4 overflow-y-auto bg-[#0C091F66]/40 rounded-lg border border-[#6435DD]">
                  <div>Output: </div>
                  <pre>{output === null ? "" : output}</pre>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-2 flex gap-3 justify-end text-white font-bold text-xl">
            <button
              onClick={runCode}
              disabled={Boolean(submissionId) && !output}
              className="w-[150px] h-[50px] bg-[#6435DD] disabled:bg-[#361D77] disabled:cursor-not-allowed border-2 border-[#6435DD] rounded-md hover:bg-[#361D77] transition-colors shadow-md"
            >
              Run
            </button>
            <button
              onClick={submitCode}
              disabled={
                Boolean(submitSubmissionId) &&
                (!submitResult ||
                  submitResult?.status?.toLowerCase() === "accepted")
              }
              className="w-[150px] h-[50px] border-2 rounded-md shadow-md flex items-center justify-center text-white font-bold transition-colors
      bg-[#6435DD] border-[#6435DD] hover:bg-[#361D77]
      disabled:bg-[#361D77] disabled:cursor-not-allowed disabled:opacity-70"
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
