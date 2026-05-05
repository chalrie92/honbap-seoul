"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, Star, MapPin } from "lucide-react";

export interface MenuItem {
  name: string;
  price: string;
}

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
  menu?: MenuItem[];
  description?: string;
  naverMapUrl?: string;
  isSoloFriendly?: boolean;
  hasJapaneseMenu?: boolean;
  isLateNight?: boolean;
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

  const handleSelect = (id: string | null) => {
    onSelect(id);
    if (id) setIsExpanded(true);
    else setIsExpanded(false);
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20 flex flex-col overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0, height: selectedRestaurant ? (isExpanded ? "80%" : "35%") : "35%" }}
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
          {selectedRestaurant ? "선택된 식당" : "주변 추천 식당"}
        </h2>
        {selectedRestaurant && (
          <button
            onClick={() => handleSelect(null)}
            className="text-sm text-blue-500 font-medium bg-blue-50 px-3 py-1 rounded-full"
          >
            목록으로
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 pb-10">
        <AnimatePresence mode="wait">
          {displayList.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex flex-col gap-4 p-4 bg-white border rounded-2xl shadow-sm cursor-pointer transition-colors ${selectedId === r.id ? 'border-rose-400 bg-rose-50/10' : 'border-gray-100 hover:border-rose-200'}`}
              onClick={() => {
                if (selectedId === r.id) {
                  setIsExpanded(!isExpanded);
                } else {
                  handleSelect(r.id);
                }
              }}
            >
              <div className="flex gap-4">
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
                  <h3 className="font-bold text-gray-900 truncate">{r.name}</h3>
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
              </div>

              {/* Extended Details when selected and expanded */}
              {selectedId === r.id && isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="pt-4 border-t border-gray-50 space-y-4"
                >
                  {r.description && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">추천 이유</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{r.description}</p>
                    </div>
                  )}

                  {/* Add Address Display */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">주소</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {r.address}
                    </p>
                  </div>

                  {r.menu && r.menu.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">주요 메뉴</h4>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        {r.menu.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.naverMapUrl && (
                    <a
                      href={r.naverMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100"
                    >
                      <MapPin className="w-4 h-4" />
                      네이버 지도로 보기
                    </a>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
