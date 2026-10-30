/**
 * Utility functions for consistent status badge styling across components
 */

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type LostFoundType = 'lost' | 'found';
export type ResolvedStatus = 'resolved' | 'unresolved';
export type ClubStatus = 'Open' | 'Closed';

/**
 * Get status badge color classes for Events
 */
export const getEventStatusColor = (status: EventStatus): string => {
  const colorMap: Record<EventStatus, string> = {
    'Upcoming': 'bg-gray-100 text-gray-800',
    'Ongoing': 'bg-green-100 text-green-800',
    'Completed': 'bg-gray-100 text-gray-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status badge color classes for Complaints
 */
export const getComplaintStatusColor = (status: ComplaintStatus): string => {
  const colorMap: Record<ComplaintStatus, string> = {
    'Open': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get status badge color classes for Lost & Found items
 */
export const getLostFoundTypeColor = (type: LostFoundType): string => {
  const colorMap: Record<LostFoundType, string> = {
    'lost': 'bg-red-100 text-red-800',
    'found': 'bg-green-100 text-green-800',
  };
  return colorMap[type] || 'bg-gray-100 text-gray-800';
};

/**
 * Get resolved status badge color classes
 */
export const getResolvedStatusColor = (resolved: boolean): string => {
  return resolved ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800';
};

/**
 * Get status badge color classes for Club Recruitment
 */
export const getClubStatusColor = (status: ClubStatus): string => {
  const colorMap: Record<ClubStatus, string> = {
    'Open': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get priority badge color classes
 */
export const getPriorityColor = (priority: 'Low' | 'Medium' | 'High' | 'Urgent'): string => {
  const colorMap = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-gray-100 text-gray-800',
    'High': 'bg-orange-100 text-orange-800',
    'Urgent': 'bg-red-100 text-red-800',
  };
  return colorMap[priority] || 'bg-gray-100 text-gray-800';
};
