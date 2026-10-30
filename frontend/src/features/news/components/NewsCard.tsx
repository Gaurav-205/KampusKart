import React from 'react';
import { FiCalendar, FiTag, FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';
import { NewsItem } from '../types';
import { UI_PATTERNS } from '../../../theme/uiPatterns';
import CardImage from '../../../components/common/CardImage';

interface NewsCardProps {
  news: NewsItem;
  isAdmin?: boolean;
  onSelect: (news: NewsItem) => void;
  onEdit: (news: NewsItem) => void;
  onDelete: (id: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  isAdmin,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors duration-200 h-full flex flex-col"
      onClick={() => onSelect(news)}
    >
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <CardImage src={news.images?.[0]?.url} alt={news.title} icon={<FiFileText />} />
        
        <div className={UI_PATTERNS.badgeTopLeft}>
          <span className={UI_PATTERNS.badgeLabel}>
            <FiTag className="w-3 h-3" />
            {news.category}
          </span>
        </div>
        
        <div className={UI_PATTERNS.badgeTopRight}>
          <span className={UI_PATTERNS.badgeLabel}>
            <FiCalendar className="w-3 h-3" />
            {new Date(news.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{news.title}</h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">{news.description}</p>

        {isAdmin && (
          <div className="flex flex-row gap-2 pt-4 border-t-2 border-gray-200">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(news); }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-bold"
            >
              <FiEdit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(news._id); }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold"
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
