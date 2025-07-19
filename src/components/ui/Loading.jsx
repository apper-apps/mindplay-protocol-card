import React from "react";
import { motion } from "framer-motion";

const Loading = ({ message = "Loading games..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-gray-600 font-medium"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default Loading;