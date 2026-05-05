"use client";

import { useEffect, useRef } from "react";
import { Restaurant } from "./BottomSheet";

interface NaverMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function NaverMap({ restaurants, selectedId, onSelect }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const initMap = () => {
      const naver = (window as any).naver;
      if (!mapRef.current || !naver || !naver.maps) return false;

      console.log("Naver Maps API is ready. Initializing map...");

      // Initialize Map
      if (!mapInstanceRef.current) {
        const mapOptions = {
          center: new naver.maps.LatLng(37.5559, 126.9242), // Hongdae approx
          zoom: 15,
          mapDataControl: false,
          scaleControl: false,
          mapTypeControl: false,
          zoomControl: false,
        };

        mapInstanceRef.current = new naver.maps.Map(mapRef.current, mapOptions);
        console.log("Map instance created.");
      }
      
      // Trigger resize to ensure it fills the container
      naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
      return true;
    };

    const renderMarkers = () => {
      const naver = (window as any).naver;
      const map = mapInstanceRef.current;
      if (!map || !naver) return;

      console.log("Rendering markers for", restaurants.length, "restaurants");

      // Clear old markers
      markersRef.current.forEach((marker: any) => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      restaurants.forEach((r, index) => {
        const coords = [
          { lat: 37.5562, lng: 126.9231 },
          { lat: 37.5545, lng: 126.9255 },
          { lat: 37.5578, lng: 126.9260 }
        ];
        const lat = coords[index % coords.length].lat;
        const lng = coords[index % coords.length].lng;
        const position = new naver.maps.LatLng(lat, lng);

        const isSelected = r.id === selectedId;
        
        const content = `
          <div style="transform: translate(-50%, -100%); cursor: pointer;">
            <div style="background-color: ${isSelected ? '#e11d48' : '#ffffff'}; color: ${isSelected ? '#ffffff' : '#e11d48'}; padding: 8px; border-radius: 999px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid ${isSelected ? '#ffffff' : '#e11d48'}; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; transition: all 0.2s;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
          </div>
        `;

        const marker = new naver.maps.Marker({
          position,
          map,
          icon: {
            content,
            anchor: new naver.maps.Point(18, 36),
          },
        });

        naver.maps.Event.addListener(marker, "click", () => {
          onSelect(r.id);
          map.panTo(position);
        });

        markersRef.current.push(marker);
      });
    };

    // Try initializing immediately
    if (!initMap()) {
      const interval = setInterval(() => {
        if (initMap()) {
          clearInterval(interval);
          renderMarkers();
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      renderMarkers();
    }
  }, [restaurants, selectedId, onSelect]);

  return <div ref={mapRef} className="w-full h-full" />;
}
