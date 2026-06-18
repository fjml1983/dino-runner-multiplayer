## ADDED Requirements

### Requirement: Google OAuth popup
The system SHALL authenticate users via Google OAuth 2.0 using a popup window (no page redirect).

#### Scenario: Login via popup
- **WHEN** user clicks "Sign in with Google"
- **THEN** a Google OAuth popup opens
- **THEN** user grants permissions
- **THEN** popup returns an ID token
- **THEN** token is sent to POST /api/auth/google

#### Scenario: Popup blocked
- **WHEN** the browser blocks the popup
- **THEN** fallback redirect mode is used

### Requirement: Token verification
The backend SHALL verify Google ID tokens using google-auth-library and upsert the user record.

#### Scenario: New user
- **WHEN** token is verified and user does not exist
- **THEN** a new User record is created with google sub as id
- **THEN** a JWT session token is returned

#### Scenario: Existing user
- **WHEN** token is verified and user exists
- **THEN** user displayName and avatar are updated from token
- **THEN** a JWT session token is returned

### Requirement: JWT session
The backend SHALL issue JWTs on successful authentication and validate them on protected routes.

#### Scenario: Protected route access
- **WHEN** request includes valid JWT in Authorization header
- **THEN** route handler receives decoded user info

#### Scenario: Invalid JWT
- **WHEN** request has missing or expired JWT
- **THEN** route returns 401 Unauthorized
