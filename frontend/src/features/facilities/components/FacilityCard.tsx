import React from 'react';
import { FiMapPin, FiTag, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import { Facility } from '../types';
import { getIconByValue } from '../constants';
import { UI_PATTERNS } from '../../../theme/uiPatterns';
import CardImage from '../../../components/common/CardImage';

interface FacilityCardProps {
  facility: Facility;
  isAdmin?: boolean;
  onSelect: (facility: Facility) => void;
  onEdit: (facility: Facility) => void;
  onDelete: (id: string) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({
  facility,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const iconOption = getIconByValue(facility.icon || 'MdSchool');

  return (
    <div
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors duration-200 h-full flex flex-col"
      onClick={() => onSelect(facility)}
    >
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <CardImage src={facility.images?.[0]?.url} alt={facility.name} icon={iconOption?.icon || <MdSchool />} />
        
        <div className={UI_PATTERNS.badgeTopLeft}>
          <span className={UI_PATTERNS.badgeLabel}>
            <FiTag className="w-3 h-3" />
            {facility.type}
          </span>
        </div>
        
        <div className={`${UI_PATTERNS.badgeTopRight} max-w-[55%]`}>
          <span className={`${UI_PATTERNS.badgeLabel} max-w-full`} title={facility.location}>
            <FiMapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{facility.location}</span>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{facility.name}</h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">{facility.description}</p>

        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t-2 border-gray-200">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(facility); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(facility._id); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
