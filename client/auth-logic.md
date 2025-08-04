# Auth Logic

- When a user logs in, an access token and refresh token are created.
- When a user wants to access a protected route, they must have the access token, if not, we try and refresh the token using refresh token, otherwise they are redirected to login
  - In this case we need to have a 401 error interceptor to check for authentication errors and redirect to login.
  - Also we must include the Bearer token in the protected routes headers.

## Refresh Tokens

- A refresh token expires after 7 days. It is mostly for security purposes, to refresh and create a new access token, say when we have a 401 error.

## Logout

- On logout, the server automatically removes the refresh token cookie from the request.
- On the client, we need to manually delete the access token from memory.
- When a user tries logging in again, since the route has a Bearer token with the token in memory, and it has been deleted, they cannot access the resource, and need to login again.

- _Access token is only removed from the store on logout, on 401 errors, refresh token adds a new one and replaces the old one, so no need to delete it there._
