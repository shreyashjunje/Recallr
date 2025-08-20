import { useState, useEffect } from "react";
import logo from "../../assets/bulbon.png"; // Replace with your logo path
import logo1 from "../../assets/bulboff.png"; // Replace with your glowing logo path

export default function LogoLoader() {
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOn((prev) => !prev);
    }, 500); // Blink speed (ms)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        {/* Background Logo */}
        <img
          src={logo} // put your base logo (OFF bulb) here
          alt="Logo"
          className="w-35 h-40"
        />

        {/* Overlay "ON" glow effect */}
        <img
          src={logo1} // put your glowing (ON bulb) logo here
          alt="Logo Glow"
          className={`w-40 h-40 absolute top-0 left-0 transition-opacity duration-500 ${
            isOn ? "opacity-500" : "opacity-0"
          }`}
        />

        {/* Loader text (optional) */}
        <p className="text-center mt-4 text-lg font-semibold text-gray-600 animate-pulse">
             Loading...
        </p>
      </div>
    </div>
  );
}
