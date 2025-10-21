import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-8 h-8 border-4 border-t-blue-400 border-gray-300 dark:border-gray-700 dark:border-t-blue-400 rounded-full animate-spin"></div>
    </div>
  );
}