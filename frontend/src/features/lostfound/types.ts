export interface LostFoundItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  type: 'lost' | 'found';
  title: string;
  description: string;
  location?: string;
  date: string;
  images: { public_id: string; url: string }[];
  resolved: boolean;
  contact?: string;
  createdAt: string;
  displayText?: string;
  formattedDate?: string;
  timeAgo?: string;
  userName?: string;
}

export interface LostFoundFilters {
  type: 'all' | 'lost' | 'found';
  resolved: 'all' | 'resolved' | 'unresolved';
  search: string;
  page: number;
}
