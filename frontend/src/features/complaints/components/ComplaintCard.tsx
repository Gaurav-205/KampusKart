import React from 'react';
import { FiEdit2, FiTrash2, FiUser, FiCalendar, FiTag, FiAlertCircle } from 'react-icons/fi';
import { Complaint } from '../types';
import { UI_PATTERNS } from '../../../theme/uiPatterns';
import { UpvoteButton } from './UpvoteButton'; // Add this import
import CardImage from '../../../components/common/CardImage';
import { formatDate } from '../../../utils/formatDate';

interface ComplaintCardProps {
  complaint: Complaint;
  currentUser: any;
  onSelect: (complaint: Complaint) => void;
  onEdit: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  currentUser,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const canManage = currentUser && complaint.user && (
    complaint.user._id === currentUser._id || 
    complaint.user._id === currentUser.id || 
    currentUser.isAdmin
  );

  // State for vote count - starts from complaint data
  const [voteCount, setVoteCount] = React.useState(complaint.upvotes || 0);

  //Update voteCount when complaint prop changes (after refresh)
  React.useEffect(() => {
    setVoteCount(complaint.upvotes || 0);
  }, [complaint.upvotes]);

  const handleVoteChange = (id: string, newCount: number) => {
    setVoteCount(newCount);
  };

  const hasImage = Boolean(complaint.images?.[0]?.url);

  return (
    <div
      className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-gray-300 transition-colors duration-200 h-full flex flex-col"
      onClick={() => onSelect(complaint)}
    >
      {/* Most complaints have no photo, so only reserve the image area when there is one. */}
      <div className={hasImage ? 'relative h-48 sm:h-56 md:h-64 overflow-hidden' : 'px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6'}>
        {hasImage && <CardImage src={complaint.images?.[0]?.url} alt={complaint.title} icon={<FiAlertCircle />} />}
        <div className={hasImage ? `${UI_PATTERNS.badgeTopRight} flex flex-col gap-2` : 'flex flex-wrap gap-2'}>
          <span className={`${UI_PATTERNS.badgeLabel} ${
            complaint.status === 'Open' ? 'bg-red-100 text-red-800' :
            complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {complaint.status}
          </span>
          <span className={`${UI_PATTERNS.badgeLabel} ${
            complaint.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
            complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' :
            complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {complaint.priority} Priority
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{complaint.title}</h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow">{complaint.description}</p>

        <div className="space-y-3 pt-4 border-t-2 border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <FiTag className="mr-2 flex-shrink-0" />
            <span className="truncate">{complaint.category}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiUser className="mr-2 flex-shrink-0" />
            <span className="truncate">By {complaint.user?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FiCalendar className="mr-2 flex-shrink-0" />
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
            {/* Added Upvote Button */}
            <UpvoteButton 
              complaintId={complaint._id}
              initialVoteCount={voteCount}
              onVoteChange={handleVoteChange}
            />
          </div>
        </div>

        {canManage && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t-2 border-gray-200">
            {!['Resolved', 'Closed'].includes(complaint.status) && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(complaint); }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium"
              >
                <FiEdit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(complaint._id); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};