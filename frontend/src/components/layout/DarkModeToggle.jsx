import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div
      className="dropdown-item d-flex align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <FaSun className="me-2" /> : <FaMoon className="me-2" />}
      {darkMode ? "Light Mode" : "Dark Mode"}
    </div>
  );
};

export default DarkModeToggle;
