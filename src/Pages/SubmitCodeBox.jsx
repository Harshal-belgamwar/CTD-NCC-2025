



const SubmitCodeBox = ({ question, onClose }) => {
  if (!question) return null;

  // Decode the Base64 code
  let decodedCode = question.code;
  try {
    decodedCode = atob(question.code);
  } catch (err) {
    console.error("Failed to decode code:", err);
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#1F1F2E] text-white p-6 rounded-xl w-full max-w-3xl shadow-2xl border border-[#444466]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md transition-colors"
        >
          Close
        </button>

        {/* Header: Filename or Language */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          {question.filename ? (
            <p className="font-semibold text-sm text-[#A0A0A0] truncate">
              {question.filename} ({question.language})
            </p>
          ) : (
            <span className="font-semibold text-sm text-[#A0A0A0]">
              Language: {question.language}
            </span>
          )}
        </div>

        {/* Code block */}
        <div className="bg-[#2A2A40] p-5 rounded-lg overflow-auto max-h-[70vh] border border-[#555577] shadow-inner">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm sm:text-base">
            <code>{decodedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SubmitCodeBox;

