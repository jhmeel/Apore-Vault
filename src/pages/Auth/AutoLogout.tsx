import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import Logout from "./Logout.js";
const AutoLogout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User has switched tabs or minimized the window
        timeoutId = setTimeout(() => {
          handleLogout();
        }, 5000); // 5 seconds delay, adjust as needed
      } else {
        // User is back, clear the timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      handleLogout();
      event.preventDefault();
      event.returnValue = ""; // This is required for older browsers
    };

    const handleLogout = async () => {
      try {
        await Logout();
        navigate("/auth/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [signOut, navigate]);

  return null;
};

export default AutoLogout;
