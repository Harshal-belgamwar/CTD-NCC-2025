import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Instructions from "./Pages/Instructions";
import CodeEditor from "./Pages/CodeEditor";
import Leaderboard from "./Pages/LeaderBoard";
import QuestionHub from "./Pages/QuestionHub";
import Results from "./Pages/Results";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/question-hub" element={<QuestionHub />} />
        <Route path="/codeeditor" element={<CodeEditor />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      {/* <Login/> */}
      {/* <Instructions/> */}
      {/* <QuestionHub/> */}
      {/* <CodeEditor/> */}
      {/* <Leaderboard/> */}
      {/* <Results/> */}
    </div>
  );
}

export default App;
