import React from 'react';
import { FiCalendar, FiTag, FiUsers } from 'react-icons/fi';
import { Club } from '../types';
import { UI_PATTERNS } from '../../../theme/uiPatterns';
import CardImage from '../../../components/common/CardImage';
import { formatShortDate } from '../../../utils/formatDate';

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club, onSelect }) => {
  // A recruitment can be closed while its form link still exists, so check both.
  const canApply = club.status === 'Open' && Boolean(club.formUrl);

  return (
    <div 
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors duration-200 h-full flex flex-col"
      onClick={() => onSelect(club)}
    >
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <CardImage src={club.image?.url} alt={club.title} icon={<FiUsers />} />
        <div className={UI_PATTERNS.badgeTopRight}>
          <span className={`${UI_PATTERNS.badgeLabel} ${club.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {club.status}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{club.title}</h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">{club.description}</p>
        
        <div className="space-y-3 pt-4 border-t-2 border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <FiTag className="mr-2 flex-shrink-0 text-gray-400" />
            <span className="font-medium text-gray-900">{club.clubName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar className="mr-2 flex-shrink-0 text-gray-400" />
            <span>{formatShortDate(club.startDate)} - {formatShortDate(club.endDate)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-gray-200">
          <button
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-colors duration-200 ${
              canApply 
                ? 'bg-kk-ink text-white hover:bg-kk-graphite active:bg-kk-ink' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!canApply}
            onClick={e => { 
              e.stopPropagation(); 
              if (canApply) window.open(club.formUrl, '_blank', 'noopener,noreferrer'); 
            }}
          >
            {canApply ? 'Apply now' : 'Applications closed'}
          </button>
        </div>
      </div>
    </div>
  );
};
