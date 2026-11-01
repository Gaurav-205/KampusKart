# Backend API Reference

All endpoints are prefixed with /api. Auth required means send Authorization: Bearer <token>.

## Auth
### POST /api/auth/signup
- Auth: No
- Body: { email, password, name }
- Validation: email format, password length and complexity, name 2 to 50 chars
- Response: { token, user: { id, email, name, isAdmin } }

### POST /api/auth/login
- Auth: No
- Body: { email, password }
- Response: { token, user: { id, email, name, isAdmin } }

### GET /api/auth/google
- Auth: No
- Redirects to Google OAuth

### GET /api/auth/google/callback
- Auth: No
- Redirects to the frontend with a token query param

### POST /api/auth/forgot-password
- Disabled: returns 503 { message }

### POST /api/auth/reset-password
- Disabled: returns 503 { message }

### POST /api/auth/refresh
- Auth: Yes
- Response: { token }

## User
### GET /api/user/profile
- Auth: Yes
- Response: { user: { id, email, name, phone } }

### PUT /api/user/profile
- Auth: Yes
- Body: { name, phone }
- Response: { user: { id, email, name, phone } }

## Profile
### GET /api/profile
- Auth: Yes
- Response: full user profile (without password and OTP fields), plus isAdmin

### PUT /api/profile
- Auth: Yes
- Content-Type: multipart/form-data
- Fields: name, phone, major, yearOfStudy, gender, dateOfBirth, program
- File: profilePicture
- Response: updated profile

## Lost and Found
### POST /api/lostfound
- Auth: Yes
- Content-Type: multipart/form-data
- Fields: type (lost or found), title, description, location, date, contact
- Files: images (max 5)
- Response: created item

### GET /api/lostfound
- Auth: No
- Query: type, resolved, search, page, limit
- Response: { items, totalItems, totalPages }

### GET /api/lostfound/:id
- Auth: No
- Response: item

### PUT /api/lostfound/:id
- Auth: Yes
- Content-Type: multipart/form-data
- Fields: type, title, description, location, date, contact, resolved, keepImages
- keepImages: JSON array of Cloudinary public_id values to keep
- Files: images (max 5)
- Notes: resolved items cannot be edited

### DELETE /api/lostfound/:id
- Auth: Yes
- Soft delete by owner or admin

### PATCH /api/lostfound/:id/resolve
- Auth: Yes
- Marks item resolved and sets resolvedAt

### GET /api/lostfound/suggestions
- Auth: Yes
- Query: query
- Response: array of suggestion objects

### Admin endpoints
- GET /api/lostfound/admin/all (query: type, resolved, search, page, limit, includeDeleted)
- PATCH /api/lostfound/admin/:id/restore
- DELETE /api/lostfound/admin/:id/permanent
- POST /api/lostfound/admin/cleanup-expired

## Complaints
### GET /api/complaints
- Auth: Yes
- Query: status, category, search, page, limit
- Response: { complaints, totalItems, totalPages }

### POST /api/complaints
- Auth: Yes
- Content-Type: multipart/form-data
- Fields: title, description, category, priority, department
- Files: images (max 5)

### PUT /api/complaints/:id
- Auth: Yes
- Owner or admin can update
- Admin can update status; updates statusHistory with statusComment
- keepImages: JSON array of Cloudinary public_id values to keep
- Files: images (max 5)

### DELETE /api/complaints/:id
- Auth: Yes
- Soft delete by owner or admin

### Admin endpoints
- GET /api/complaints/admin/all (query: status, search, page, limit, includeDeleted)
- PATCH /api/complaints/admin/:id/restore
- DELETE /api/complaints/admin/:id/permanent
- POST /api/complaints/admin/cleanup-expired

## News
### GET /api/news
- Auth: No
- Query: category, search, page, limit

### POST /api/news
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: title, description, date, category
- Files: images (max 5)

### PUT /api/news/:id
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: title, description, date, category, keepImages
- Files: images (max 5)

### DELETE /api/news/:id
- Auth: Admin only

## Events
### GET /api/events
- Auth: No
- Query: status, search, page, limit

### POST /api/events
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: title, description, date, location, status, registerUrl, operatingHours, contactInfo, mapLocation
- contactInfo and mapLocation are JSON strings in form data
- File: image

### PUT /api/events/:id
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: title, description, date, location, status, registerUrl, operatingHours, contactInfo, mapLocation
- Optional: removeImage=true
- File: image

### DELETE /api/events/:id
- Auth: Admin only

## Facilities
### GET /api/facilities
- Auth: No
- Query: type, search, page, limit

### POST /api/facilities
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: name, description, location, type, icon
- Files: images (max 5)

### PUT /api/facilities/:id
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: name, description, location, type, icon, keepImages
- Files: images (max 5)

### DELETE /api/facilities/:id
- Auth: Admin only

## Clubs Recruitment
### GET /api/clubs
- Auth: No
- Query: status, search, page, limit

### POST /api/clubs
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: title, description, clubName, startDate, endDate, formUrl, contactInfo, status
- contactInfo is JSON string in form data
- File: image

### PUT /api/clubs/:id
- Auth: Admin only
- Content-Type: multipart/form-data
- Fields: title, description, clubName, startDate, endDate, formUrl, contactInfo, status
- contactInfo is JSON string in form data
- File: image

### DELETE /api/clubs/:id
- Auth: Admin only

## Chat
### GET /api/chat/messages
- Auth: Yes
- Query: page, limit
- Response: { messages, pagination: { total, page, pages } }

### GET /api/chat/search
- Auth: Yes
- Query: query

### POST /api/chat/messages
- Auth: Yes
- Content-Type: multipart/form-data
- Fields: message, replyTo
- Files: attachments (max 5)

### PATCH /api/chat/messages/:messageId
- Auth: Yes
- Body: { message }

### DELETE /api/chat/messages/:messageId
- Auth: Yes
- Soft delete; owner or admin

### DELETE /api/chat/messages/:messageId/permanent
- Auth: Admin only

### POST /api/chat/messages/:messageId/reactions
- Auth: Yes
- Body: { emoji }

### POST /api/chat/messages/:messageId/read
- Auth: Yes

### POST /api/chat/cleanup-orphaned-attachments
- Auth: Admin only

## Health
### GET /api/health
- Auth: No
- Response: status, message, timestamp, uptime, environment

### GET /api/server-status
- Auth: No
- Response: status, message, timestamp, uptime

## Rate limiting (summary)
- /api/auth/login: 10 requests per 15 minutes
- /api/auth/signup: 5 requests per hour
- /api/lostfound writes: 100 requests per 15 minutes
- /api/news, /api/events, /api/facilities, /api/clubs writes: 50 requests per 15 minutes
- /api/chat/messages: 30 messages per minute
