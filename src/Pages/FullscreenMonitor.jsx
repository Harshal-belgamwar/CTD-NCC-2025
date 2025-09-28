import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const FullscreenMonitor = () => {
  const [exitCount, setExitCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const enterFullscreen = async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
    } catch {
      toast.warn("⚠ Fullscreen request failed. Press F11 manually.");
    }
  };

  const handleLogout = async () => {
    // Clear non-solved localStorage keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key.startsWith("solved_")) {
        localStorage.removeItem(key);
      }
    }
    setExitCount(0); // Reset state
    await axios.post(
      `${API_URL}/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    toast.error("You are logged out due to multiple fullscreen exits.", {
      position: "top-center",
      autoClose: 3000,
    });
    navigate("/"); // Redirect to login
  };

  useEffect(() => {
    if (location.pathname === "/") return; // Skip login page

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        const newCount = exitCount + 1;
        setExitCount(newCount);

        toast.warn(`⚠ Fullscreen exit detected! Exit count: ${newCount}`);

        if (newCount >= 3) {
          
          setTimeout(handleLogout, 1000);
        }
      }
    };

    const handleUserGesture = () => {
      if (!document.fullscreenElement) {
        // Only call requestFullscreen inside user gesture
        enterFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("click", handleUserGesture);
    document.addEventListener("keydown", handleUserGesture);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("click", handleUserGesture);
      document.removeEventListener("keydown", handleUserGesture);
    };
  }, [exitCount, location.pathname]);

  return null;
};

export default FullscreenMonitor;
