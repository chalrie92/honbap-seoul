"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Star, MapPin } from "lucide-react";

export interface Restaurant {
  id: string;
  name: string;
  nameJp: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  tags: string[];
  imageUrl: string;
}

interface BottomSheetProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function BottomSheet({ restaurants, selectedId, onSelect }: BottomSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedRestaurant = selectedId ? restaurants.find((r) => r.id === selectedId) : null;
  const displayList = selectedRestaurant ? [selectedRestaurant] : restaurants;

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20 flex flex-col overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0, height: isExpanded ? "80%" : "35%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      {/* Drag Handle */}
      <div
        className="w-full flex justify-center items-center py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* Header */}
      <div className="px-5 pb-3 border-b border-gray-100 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold text-gray-800">
          {selectedRestaurant ? "選択された店舗" : "周辺のおすすめ店舗"}
        </h2>
        {selectedRestaurant && (
          <button
            onClick={() => onSelect(null)}
            className="text-sm text-blue-500 font-medium bg-blue-50 px-3 py-1 rounded-full"
          >
            一覧に戻る
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
        <AnimatePresence>
          {displayList.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm cursor-pointer hover:border-rose-200 transition-colors"
              onClick={() => onSelect(r.id)}
            >
              <img
                src={r.imageUrl}
                alt={r.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    {r.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {r.rating} <span className="text-gray-400 font-normal">({r.reviews})</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 truncate">{r.nameJp}</h3>
                <p className="text-xs text-gray-500 truncate mb-2">{r.name}</p>
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
