"use client";

import { useState } from "react";
import { MapPin, Search, Plus } from "lucide-react";
import BottomSheet, { Restaurant } from "@/components/BottomSheet";
import SubmissionModal from "@/components/SubmissionModal";
import NaverMap from "@/components/NaverMap";

const DUMMY_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "김밥천국 홍대본점",
    nameJp: "キンパ天国 弘大本店",
    category: "軽食・粉食",
    rating: 4.2,
    reviews: 128,
    address: "서울 마포구 홍익로 10",
    tags: ["1人食いOK", "深夜営業", "コスパ最高"],
    imageUrl: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "우동카덴 홍대점",
    nameJp: "うどんカデン 弘大店",
    category: "和食・うどん",
    rating: 4.6,
    reviews: 342,
    address: "서울 마포구 양화로 100",
    tags: ["日本語メニュー", "カウンター席あり", "行列店"],
    imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "홍대 돈부리 본점",
    nameJp: "弘大どんぶり 本店",
    category: "和食・丼",
    rating: 4.4,
    reviews: 215,
    address: "서울 마포구 어울마당로 50",
    tags: ["1人食いOK", "日本語メニュー", "カウンター席あり"],
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState<string[]>(["1人食いOK"]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const filters = ["1人食いOK", "日本語メニュー", "深夜営業"];

  return (
    <main className="flex-1 relative flex flex-col h-full w-full bg-gray-200">
      {/* Background Map (Naver Maps) */}
      <div className="absolute inset-0 z-0 bg-gray-200">
        <NaverMap 
          restaurants={DUMMY_RESTAURANTS} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
      </div>

      {/* Top Header & Filters */}
      <header className="relative z-10 w-full pt-12 pb-4 px-4 flex flex-col gap-3 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none">
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="text-xl font-bold text-white drop-shadow-md flex items-center gap-1 tracking-tight">
            혼밥서울 <span className="text-[10px] font-normal opacity-90 border border-white/40 px-1.5 py-0.5 rounded-sm ml-1">ホンバプ</span>
          </h1>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-800 hover:bg-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
        
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide pointer-events-auto">
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm whitespace-nowrap transition-colors border ${
                  isActive
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white/95 text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {isActive && <span className="mr-1 opacity-80">✓</span>}
                {filter}
              </button>
            );
          })}
        </div>
      </header>

      {/* Bottom Floating Action Button (for UGC form) */}
      <div className="absolute bottom-[calc(35%+20px)] right-4 z-10 transition-all duration-300 pointer-events-auto">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white p-3.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Sheet for Restaurants */}
      <BottomSheet 
        restaurants={DUMMY_RESTAURANTS} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />

      {/* UGC Submission Modal */}
      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
