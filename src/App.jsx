import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import CodeEditor from "./Pages/CodeEditor";
import Leaderboard from "./Pages/Leaderboard";
import QuestionHub from "./Pages/QuestionHub";
import Results from "./Pages/Results";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

function App() {
  // 2. Uncomment the entire useEffect hook to activate the proctoring logic
  useEffect(() => {
    //  Disable right-click and text selection
    const disable = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disable);
    document.addEventListener("selectstart", disable);

    // Disable clipboard actions
    document.addEventListener("copy", disable);
    document.addEventListener("cut", disable);
    document.addEventListener("paste", disable);

    //  Disable keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, F12)
    const blockKeys = (e) => {
      if (
        (e.ctrlKey && ["c", "v", "x", "u"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        toast.warn("⚠ Actions like Copy/Paste are disabled!");
      }
    };
    document.addEventListener("keydown", blockKeys);

    // 👀 Detect tab switching
    const handleVisibility = () => {
      if (document.hidden) {
        toast.error("⚠ Tab switching is not allowed!");
        // Optional: you could add logic here to end the test or log the event
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // ✅ Cleanup function to remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("contextmenu", disable);
      document.removeEventListener("selectstart", disable);
      document.removeEventListener("copy", disable);
      document.removeEventListener("cut", disable);
      document.removeEventListener("paste", disable);
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []); // The empty dependency array [] ensures this effect runs only once

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/question-hub" element={<QuestionHub />} />
        <Route path="/codeeditor" element={<CodeEditor />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default App;