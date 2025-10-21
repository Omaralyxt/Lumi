import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <motion.div
        className="w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <svg className="w-full h-full" viewBox="0 0 50 50">
          <circle
            className="text-blue-600"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.416"
            strokeDashoffset={31.416}
          />
        </svg>
      </motion.div>
    </div>
  );
}