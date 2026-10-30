# Frontend Components

This section describes the primary route components and the major shared UI elements.

## Navigation and layout
- KampusKartNavbar: uses shadcn navigation menu, adapts items based on auth state, locks protected links when logged out.
- Footer: shared footer used across marketing and feature pages.
- ErrorBoundary: wraps the app and shows a friendly fallback with a reload action.

## Marketing and entry
- Landing: marketing homepage for unauthenticated users, feature cards, and CTA to signup.
- Home: authenticated landing page with feature grid and shuffle animations.
- PrivacyPolicy and TermsOfService: static legal content pages.

## Authentication screens
- Login: email and password login, remember me, Google login button, and right panel image fallback.
- Signup: account creation with password strength guidance and Google login.
- ForgotPassword: two step OTP flow for password reset with countdown timer.

## Profile
- Profile: shows user details, completion meter, edit mode, and Cloudinary profile image upload.
- Skeleton loaders appear during initial load.

## Core feature modules
- CampusMap: Google Maps integration with markers, search, and info windows.
- LostFound: create and manage lost or found posts, image uploads, filters, and admin actions.
- Complaints: create complaints, admin status updates, status history timeline, and filters.
- News: category and search filtering, admin create and edit.
- Events: status filtering, date validation, registration links, and admin editing.
- Facilities: directory with type filters and admin management.
- ClubsRecruitment: recruitment posts with date range validation and admin actions.
- ChatWindow: real time global chat with typing indicators, reactions, read receipts, edits, deletes, replies, attachments, and emoji picker.

## Shared UI patterns
- Skeleton loaders for page and list loading states.
- Modal based create and detail flows for major features.
- Shared status badges for complaint and lost and found states.
