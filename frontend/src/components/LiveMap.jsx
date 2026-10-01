import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Info } from 'lucide-react';

const GHANA_HOSPITALS = [
  { name: 'Korle Bu Teaching Hospital', lat: 5.5367, lng: -0.2289, type: 'Teaching Hospital', urgentNeed: 'O-' },
  { name: 'Greater Accra Regional Hospital (Ridge)', lat: 5.5645, lng: -0.1983, type: 'Regional Hospital', urgentNeed: 'A+' },
  { name: '37 Military Hospital', lat: 5.5888, lng: -0.1804, type: 'Military Emergency Wing', urgentNeed: 'B+' },
  { name: 'Tema General Hospital', lat: 5.6796, lng: -0.0076, type: 'General Hospital', urgentNeed: null }
];

const GHANA_DONORS = [
  { name: 'Kwame Agyeman', bloodType: 'O-', lat: 5.5562, lng: -0.2104, area: 'Adabraka' },
  { name: 'Abena Mansa', bloodType: 'O+', lat: 5.5560, lng: -0.1820, area: 'Osu' },
  { name: 'Kofi Boateng', bloodType: 'A+', lat: 5.6025, lng: -0.1772, area: 'Airport' },
  { name: 'Akua Serwaa', bloodType: 'B+', lat: 5.6428, lng: -0.1580, area: 'East Legon' },
  { name: 'Emmanuel Osei', bloodType: 'O-', lat: 5.5450, lng: -0.2650, area: 'Dansoman' }
];

export default function LiveMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Accra, Ghana
    const map = L.map(mapContainerRef.current).setView([5.5700, -0.2000], 12);
    mapInstanceRef.current = map;

    // Free OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Custom Hospital Pin Icon
    const hospitalIcon = L.divIcon({
      className: 'custom-hospital-marker',
      html: `
        <div style="background-color: #dc2626; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          🏥
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Custom Donor Pin Icon
    const donorIcon = (bloodType) => L.divIcon({
      className: 'custom-donor-marker',
      html: `
        <div style="background-color: #059669; color: white; padding: 2px 6px; border-radius: 9999px; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); white-space: nowrap;">
          🩸 ${bloodType}
        </div>
      `,
      iconSize: [40, 24],
      iconAnchor: [20, 12]
    });

    // Add Hospitals to map
    GHANA_HOSPITALS.forEach(h => {
      const popupHtml = `
        <div style="font-family: system-ui; min-width: 180px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #0f172a;">${h.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #64748b;">${h.type}</p>
          ${h.urgentNeed ? `
            <div style="margin-top: 6px; padding: 3px 6px; background-color: #fee2e2; color: #dc2626; border-radius: 4px; font-weight: bold; font-size: 11px;">
              🚨 Active Need: ${h.urgentNeed} Blood
            </div>
          ` : ''}
        </div>
      `;
      L.marker([h.lat, h.lng], { icon: hospitalIcon }).addTo(map).bindPopup(popupHtml);
    });

    // Add Donors to map
    GHANA_DONORS.forEach(d => {
      const popupHtml = `
        <div style="font-family: system-ui; min-width: 150px;">
          <h4 style="margin: 0 0 2px 0; font-size: 12px; font-weight: bold; color: #0f172a;">${d.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #64748b;">📍 ${d.area}</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: bold; color: #059669;">Blood Group: ${d.bloodType}</p>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #94a3b8; font-style: italic;">Contact masked for privacy</p>
        </div>
      `;
      L.marker([d.lat, d.lng], { icon: donorIcon(d.bloodType) }).addTo(map).bindPopup(popupHtml);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <Navigation className="w-6 h-6 text-red-600" />
            <span>Emergency Geolocation & Proximity Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing dispatch hospitals and registered donors across Greater Accra & Ghana
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-semibold">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <span>🏥</span>
            <span>Hospital / Blood Bank</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            <span>🩸</span>
            <span>Registered Donor</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="w-full h-[520px] rounded-xl z-0" 
        />
      </div>

      {/* Info footer */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Proximity Ranking:</strong> Distance is calculated using the Haversine great-circle formula between hospital coordinates and donor locations, ensuring immediate outreach to the closest biologically compatible volunteers.
        </span>
      </div>
    </div>
  );
}
