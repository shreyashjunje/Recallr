import { motion, AnimatePresence } from "framer-motion";

export default function QuoteSwiper({ fetchQuote, loading, quotes }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <AnimatePresence>
        <motion.div
          key={quotes[0]} // use quote text as key
          className="bg-white rounded-3xl shadow-2xl p-8 w-80 max-w-sm text-center cursor-grab select-none"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(e, info) => {
            if (Math.abs(info.offset.x) > 100) fetchQuote();
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-lg text-gray-800">
            {quotes[0] || "Loading..."}
          </p>
          <p className="mt-4 text-sm text-gray-400">Swipe left or right for new quote</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
