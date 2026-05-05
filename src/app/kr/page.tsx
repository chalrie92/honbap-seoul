"use client";

import { useState, useMemo } from "react";
import NaverMap from "@/components/NaverMap";
import BottomSheetKr from "@/components/BottomSheetKr";
import SubmissionModalKr from "@/components/SubmissionModalKr";
import { Restaurant } from "@/types";

const DUMMY_RESTAURANTS_KR: Restaurant[] = [
  {
    id: "1",
    name: "김밥천국 홍대본점",
    nameJp: "김밥천국 홍대본점",
    category: "분식",
    rating: 4.2,
    reviews: 128,
    address: "서울 마포구 어울마당로 123",
    tags: ["혼밥환영", "심야영업", "가성비갑"],
    imageUrl: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=300&auto=format&fit=crop",
    description: "싸고 맛있는 한국의 소울푸드. 카운터석이 있어서 혼자서도 눈치 보지 않고 먹을 수 있습니다. 24시간 영업이라 늦은 밤 야식으로 최고예요.",
    naverMapUrl: "https://naver.me/example1",
    coordinates: { lat: 37.5562, lng: 126.9231 },
    menu: [
      { name: "원조김밥", price: "3,500원" },
      { name: "라볶이", price: "5,500원" },
      { name: "치즈돈까스", price: "8,000원" }
    ]
  },
  {
    id: "2",
    name: "우동카덴 홍대점",
    nameJp: "우동카덴 홍대점",
    category: "일식·우동",
    rating: 4.6,
    reviews: 342,
    address: "서울 마포구 양화로 123",
    tags: ["일본어메뉴", "다찌석", "웨이팅맛집"],
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop",
    description: "본격적인 수타 우동을 즐길 수 있는 인기 식당. 혼자 이용하기 좋은 카운터석이 잘 되어 있습니다. 일본어 메뉴판도 준비되어 있어요.",
    naverMapUrl: "https://naver.me/example2",
    coordinates: { lat: 37.5545, lng: 126.9255 },
    menu: [
      { name: "가케우동", price: "9,000원" },
      { name: "튀김우동", price: "13,000원" },
      { name: "명란우동", price: "11,000원" }
    ]
  },
  {
    id: "3",
    name: "홍대돈부리 본점",
    nameJp: "홍대돈부리 본점",
    category: "일식·덮밥",
    rating: 4.4,
    reviews: 215,
    address: "서울 마포구 잔다리로 123",
    tags: ["혼밥OK", "일본어대응", "빠른식사"],
    imageUrl: "https://images.unsplash.com/photo-1591814448473-7af27feaf71e?q=80&w=300&auto=format&fit=crop",
    description: "일본의 맛이 그리워질 때 딱인 덮밥 전문점. 직원분들이 친절하시고 1인용 좌석도 확보되어 있습니다. 회전율이 빨라 뚝딱 먹고 가기 좋아요.",
    naverMapUrl: "https://naver.me/example3",
    coordinates: { lat: 37.5578, lng: 126.9260 },
    menu: [
      { name: "사케동", price: "12,000원" },
      { name: "가츠동", price: "9,500원" },
      { name: "에비후라이동", price: "10,500원" }
    ]
  },
];

export default function KoreanPage() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>(DUMMY_RESTAURANTS_KR);
  const [visibleIds, setVisibleIds] = useState<string[]>(DUMMY_RESTAURANTS_KR.map(r => r.id));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleSubmissionSuccess = (newRestaurant: any) => {
    setAllRestaurants(prev => [...prev, newRestaurant]);
  };

  // Filter restaurants based on visibleIds
  const visibleRestaurants = useMemo(() => {
    return allRestaurants.filter(r => visibleIds.includes(r.id));
  }, [allRestaurants, visibleIds]);

  return (
    <main className="relative w-full h-full flex flex-col bg-gray-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-5 pt-12 pb-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <h1 className="text-2xl font-black text-white drop-shadow-md">
          혼밥서울 <span className="text-sm font-normal opacity-90 ml-1">(개발용)</span>
        </h1>
        <p className="text-sm text-white/90 font-medium drop-shadow-sm mt-1">
          한국어 더미 데이터 테스트 페이지
        </p>
      </header>

      {/* Floating Action Button (Submit) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-12 right-5 z-20 bg-rose-500 text-white px-4 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-rose-600 transition-colors"
      >
        <span className="text-sm">+ 맛집 제보</span>
      </button>

      {/* Background Map (Naver Maps) */}
      <div className="absolute inset-0 z-0 bg-gray-200">
        <NaverMap 
          restaurants={allRestaurants} 
          selectedId={selectedId}
          onSelect={setSelectedId}
          onVisibleRestaurantsChange={setVisibleIds}
        />
      </div>

      {/* Bottom Sheet Component */}
      <BottomSheetKr 
        restaurants={visibleRestaurants}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Submission Modal Component */}
      <SubmissionModalKr 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleSubmissionSuccess}
      />
    </main>
  );
}
