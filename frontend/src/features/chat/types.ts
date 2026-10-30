export interface ChatUser {
  _id?: string;
  id?: string;
  name?: string;
  profilePicture?: string | { url?: string };
}

export interface ChatAttachment {
  type?: string;
  url: string;
  name: string;
}

export interface ChatReaction {
  emoji?: string;
  user?: ChatUser;
}

export interface ChatReadEntry {
  user?: ChatUser;
}

export interface ChatMessage {
  _id: string;
  message: string;
  sender?: ChatUser;
  timestamp?: string;
  edited?: boolean;
  attachments?: ChatAttachment[];
  reactions?: ChatReaction[];
  readBy?: ChatReadEntry[];
  replyTo?: ChatMessage;
}

export interface PaginatedChatResponse {
  messages: ChatMessage[];
  pagination?: {
    page: number;
    pages: number;
  };
}

export interface ServerToClientEvents {
  'previous-messages': (data: ChatMessage[] | PaginatedChatResponse) => void;
  connect_error: () => void;
  disconnect: (reason: string) => void;
  connect: () => void;
  'new-message': (message: ChatMessage) => void;
  'online-users': (users: ChatUser[]) => void;
  'user-typing': (userData: ChatUser) => void;
  'user-stop-typing': (userData: ChatUser) => void;
  'message-updated': (updatedMessage: ChatMessage) => void;
  'message-deleted': (data: { _id: string }) => void;
}

// Mirrors the handlers registered in backend/server.js
export interface ClientToServerEvents {
  join: (data: { _id?: string; name?: string; profilePicture?: string | { url?: string } }) => void;
  'send-message': (data: { message: string }) => void;
  typing: (data: { _id?: string; name?: string }) => void;
  'stop-typing': (data: { _id?: string; name?: string }) => void;
}
