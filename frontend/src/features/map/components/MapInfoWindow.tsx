import React from 'react';
import { FiX, FiTag, FiInfo, FiNavigation } from 'react-icons/fi';
import { Location } from '../types';

interface MapInfoWindowProps {
  location: Location;
  onClose: () => void;
  onGetDirections: (loc: Location) => void;
}

export const MapInfoWindow: React.FC<MapInfoWindowProps> = ({
  location,
  onClose,
  onGetDirections,
}) => {
  return (
    <div className="w-[min(92vw,360px)] bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-2xl">
      {/* Header */}
      <div className="bg-white p-5 border-b-2 border-gray-50 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"
        >
          <FiX className="w-4 h-4" />
        </button>
        
        <div className="pr-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-50 text-kk-accent text-[10px] font-bold uppercase tracking-widest mb-2 border border-gray-100">
            <FiTag className="mr-1" /> {location.category}
          </span>
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            {location.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2 text-gray-400">
            <FiInfo className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-widest">About</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {location.description}
          </p>
        </div>

        <button
          onClick={() => onGetDirections(location)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-kk-ink hover:bg-kk-graphite text-white rounded-xl font-bold transition-all shadow-lg shadow-gray-200"
        >
          <FiNavigation className="w-5 h-5" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
};
