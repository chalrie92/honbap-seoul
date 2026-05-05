"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { useState } from "react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

export default function SubmissionModal({ isOpen, onClose, onSubmitSuccess }: SubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    naverMapUrl: "",
    isSoloFriendly: null as boolean | null,
    hasJapaneseMenu: null as boolean | null,
    isLateNight: null as boolean | null,
    description: "",
    imageFile: null as File | null,
    coordinates: null as { lat: number; lng: number } | null,
  });

  const [mapRef, setMapRef] = useState<HTMLDivElement | null>(null);
  const [miniMap, setMiniMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Update preview when image changes
  const handleImageChange = (file: File) => {
    setFormData({ ...formData, imageFile: file });
    if (typeof window !== "undefined") {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const searchAddress = () => {
    if (!formData.address) return;
    
    const naver = (window as any).naver;
    if (naver && naver.maps && naver.maps.Service) {
      naver.maps.Service.geocode({ query: formData.address }, function(status: any, response: any) {
        if (status !== naver.maps.Service.Status.OK) {
          alert('주소를 찾을 수 없습니다.');
          return;
        }
        
        const result = response.v2.addresses[0];
        if (result) {
          const lat = parseFloat(result.y);
          const lng = parseFloat(result.x);
          
          setFormData(prev => ({ ...prev, coordinates: { lat, lng } }));

          if (mapRef) {
            const position = new naver.maps.LatLng(lat, lng);
            if (!miniMap) {
              const newMap = new naver.maps.Map(mapRef, {
                center: position,
                zoom: 16,
              });
              setMiniMap(newMap);
              const newMarker = new naver.maps.Marker({
                position,
                map: newMap
              });
              setMarker(newMarker);
            } else {
              miniMap.setCenter(position);
              if (marker) {
                marker.setPosition(position);
              }
            }
          }
        }
      });
    } else {
      alert("지도 서비스가 아직 준비되지 않았습니다.");
    }
  };

  const isFormValid = 
    formData.name && 
    formData.address &&
    formData.naverMapUrl && 
    formData.isSoloFriendly !== null && 
    formData.hasJapaneseMenu !== null && 
    formData.isLateNight !== null && 
    formData.description;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
        // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Pass data back immediately for MVP testing
      if (onSubmitSuccess) {
        onSubmitSuccess({
          id: Date.now().toString(),
          name: formData.name,
          nameJp: formData.name, 
          category: "새로 등록됨",
          rating: 0,
          reviews: 0,
          address: formData.address,
          tags: [
            formData.isSoloFriendly ? "혼밥가능" : "",
            formData.hasJapaneseMenu ? "일본어메뉴" : "",
            formData.isLateNight ? "심야영업" : ""
          ].filter(Boolean),
          imageUrl: imagePreview || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=300&auto=format&fit=crop",
          description: formData.description,
          naverMapUrl: formData.naverMapUrl,
          coordinates: formData.coordinates
        });
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setFormData({
          name: "",
          address: "",
          naverMapUrl: "",
          isSoloFriendly: null,
          hasJapaneseMenu: null,
          isLateNight: null,
          description: "",
          imageFile: null,
          coordinates: null,
        });
        if (miniMap) {
          miniMap.destroy();
          setMiniMap(null);
          setMarker(null);
        }
        setImagePreview(null);
      }, 2000);
    }, 1500);
  };

  const YesNoToggle = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string, 
    value: boolean | null, 
    onChange: (val: boolean) => void 
  }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-700">{label} <span className="text-rose-500">*</span></span>
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            value === true ? "bg-white text-rose-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          YES
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            value === false ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          NO
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="absolute bottom-0 left-0 right-0 top-10 bg-white rounded-t-[40px] z-50 shadow-2xl flex flex-col"
          >
            <div className="w-full flex justify-center items-center py-4 shrink-0">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex-1 overflow-y-auto px-6 pb-10">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">제보 완료!</h3>
                  <p className="text-gray-500">소중한 정보 감사합니다.<br />관리자 승인 후 지도에 반영됩니다.</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">맛집 제보하기</h2>
                    <p className="text-sm text-gray-500">혼자 여행하는 여성들을 위한 최고의 맛집을 알려주세요!</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">식당 이름 <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="정확한 식당 명칭을 입력해주세요"
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">주소 <span className="text-rose-500">*</span></label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="도로명 주소 등을 입력해주세요"
                            className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all"
                          />
                          <button
                            type="button"
                            onClick={searchAddress}
                            className="px-4 bg-gray-900 text-white rounded-2xl text-xs font-bold whitespace-nowrap hover:bg-black transition-colors"
                          >
                            위치 확인
                          </button>
                        </div>
                        {/* Mini Map Container */}
                        <div 
                          ref={(el) => setMapRef(el)} 
                          className={`mt-2 rounded-xl overflow-hidden transition-all duration-300 ${formData.coordinates ? 'h-32 opacity-100' : 'h-0 opacity-0'}`}
                          style={{ background: '#eee' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">네이버 지도 링크 <span className="text-rose-500">*</span></label>
                        <div className="relative">
                          <input
                            type="url"
                            required
                            value={formData.naverMapUrl}
                            onChange={(e) => setFormData({...formData, naverMapUrl: e.target.value})}
                            placeholder="https://naver.me/..."
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all"
                          />
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="bg-gray-50/50 rounded-3xl p-4 space-y-1 border border-gray-50">
                      <YesNoToggle 
                        label="혼밥 가능 여부" 
                        value={formData.isSoloFriendly} 
                        onChange={(v) => setFormData({...formData, isSoloFriendly: v})} 
                      />
                      <div className="h-px bg-gray-100 mx-2" />
                      <YesNoToggle 
                        label="일본어 메뉴 제공" 
                        value={formData.hasJapaneseMenu} 
                        onChange={(v) => setFormData({...formData, hasJapaneseMenu: v})} 
                      />
                      <div className="h-px bg-gray-100 mx-2" />
                      <YesNoToggle 
                        label="밤 10시 이후 영업" 
                        value={formData.isLateNight} 
                        onChange={(v) => setFormData({...formData, isLateNight: v})} 
                      />
                    </div>

                    {/* Recommendation */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">추천 이유 (현지인 팁 등) <span className="text-rose-500">*</span></label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="이곳을 추천하는 이유와 꿀팁을 적어주세요"
                        rows={4}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-sm transition-all resize-none"
                      />
                    </div>

                    {/* Image Upload (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">음식 또는 메뉴판 사진 (선택)</label>
                      <label className="w-full py-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer relative overflow-hidden">
                        {imagePreview ? (
                          <div className="absolute inset-0 w-full h-full">
                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                              <Camera className="w-6 h-6 mb-1" />
                              <span className="text-xs font-medium">사진 변경하기</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-8 h-8" />
                            <span className="text-xs font-medium">사진 추가하기</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageChange(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFormValid}
                      className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-base shadow-lg disabled:opacity-30 disabled:bg-gray-400 transition-all flex justify-center items-center h-[60px]"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "제보 완료하기"
                      )}
                    </button>

                    {!isFormValid && !isSubmitting && (
                      <p className="flex items-center justify-center gap-1.5 text-[11px] text-rose-400 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        모든 필수 항목을 입력해주세요
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
