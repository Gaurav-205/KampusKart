# State, Context, and Hooks

## AuthContext
AuthContext centralizes authentication state and behavior:
- Loads tokens from localStorage or sessionStorage on boot
- Fetches user profile when a token is present
- Stores tokens with optional remember me behavior
- Refreshes tokens before expiry
- Retries login and signup to handle backend cold start
- Supports Google OAuth callback handling

Key methods:
- login(email, password, remember)
- signup(email, password, name, remember)
- loginWithGoogle()
- handleGoogleCallback(token)
- updateProfile(data)
- refreshToken()

## Hooks
- useSearchSuggestions: builds a suggestion list from client side data and controls visibility

## Utilities
- cn: merges Tailwind classes with clsx and tailwind-merge

## State management approach
KampusKart uses React local state plus context. Feature modules keep their state local and call the API directly. The app avoids a global state library by keeping state scoped to routes and shared contexts.
