"use client";

import { useEffect, useRef } from "react";
import { Restaurant } from "@/types";

interface NaverMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onVisibleRestaurantsChange?: (ids: string[]) => void;
}

export default function NaverMap({ restaurants, selectedId, onSelect, onVisibleRestaurantsChange }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const initMap = () => {
      const naver = (window as any).naver;
      if (!mapRef.current || !naver || !naver.maps) return false;

      // Initialize Map
      if (!mapInstanceRef.current) {
        const mapOptions = {
          center: new naver.maps.LatLng(37.5559, 126.9242),
          zoom: 15,
          mapDataControl: false,
          scaleControl: false,
          mapTypeControl: false,
          zoomControl: false,
          mapTypeId: naver.maps.MapTypeId.NORMAL
        };

        const map = new naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // Add bounds change listener
        naver.maps.Event.addListener(map, 'idle', () => {
          const bounds = map.getBounds();
          const visibleIds = restaurants
            .filter(r => {
              if (!r.coordinates) return false;
              const pos = new naver.maps.LatLng(r.coordinates.lat, r.coordinates.lng);
              return bounds.hasLatLng(pos);
            })
            .map(r => r.id);
          
          if (onVisibleRestaurantsChange) {
            onVisibleRestaurantsChange(visibleIds);
          }
        });
      }
      
      naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
      return true;
    };

    const renderMarkers = () => {
      const naver = (window as any).naver;
      const map = mapInstanceRef.current;
      if (!map || !naver) return;

      // Clear old markers
      markersRef.current.forEach((marker: any) => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      restaurants.forEach((r) => {
        if (!r.coordinates) return;
        
        const position = new naver.maps.LatLng(r.coordinates.lat, r.coordinates.lng);
        const isSelected = r.id === selectedId;
        
        const content = `
          <div style="transform: translate(-50%, -100%); cursor: pointer;">
            <div style="background-color: ${isSelected ? '#e11d48' : '#ffffff'}; color: ${isSelected ? '#ffffff' : '#e11d48'}; padding: 8px; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 2px solid ${isSelected ? '#ffffff' : '#e11d48'}; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
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
  }, [restaurants, selectedId, onSelect, onVisibleRestaurantsChange]);

  return <div ref={mapRef} className="w-full h-full" />;
}
