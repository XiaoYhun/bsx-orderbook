"use client";
import { motion } from "framer-motion";

export default function Background() {
  return (
    <>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        style={{
          inset: "-100%",
          background:
            "conic-gradient(from 15deg at 56% 48%, rgb(28, 46, 177), rgb(30, 71, 237), rgb(21, 127, 148), rgb(22, 104, 67), rgb(27, 55, 218), rgb(28, 46, 177), rgb(45, 45, 58), rgb(22, 32, 32), rgb(22, 22, 49))",
          willChange: "transform",
        }}
        className="absolute flex place-items-center place-content-center z-0"
      ></motion.div>
      <div className="absolute -inset-10 backdrop-blur-3xl"></div>
    </>
  );
}
