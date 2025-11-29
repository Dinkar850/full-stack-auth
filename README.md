## Auth using http-cookies and access + refresh tokens

- used jwt, cors, cookie-parser, axios, axios interceptors for post and get at all routes.

### Inside the api interceptor for refreshing:

When the access token expires, the first failing request (**Request #1**) enters
the interceptor, sees that no refresh is in progress, sets `isRefreshing = true`,
and starts the `/auth/refresh` call. Any other requests (**Request #2**,
**Request #3**, etc.) that fail with `401` **while the refresh is ongoing**
detect that `isRefreshing` is already `true`, so they do _not_ try to refresh
again. Instead, each returns a **pending Promise** and adds a callback to a
shared `refreshSubscribers` queue, effectively “pausing” the request without
failing it. Once **Request #1** finishes refreshing and receives the new access
token, the interceptor calls `onRefreshed(newToken)`, which executes all queued
callbacks: each callback updates its original request with the new token and
**resolves** its pending Promise by retrying the request. This ensures the
refresh is performed exactly once, all paused requests resume cleanly with the
new token, and the user experiences no interruption even when multiple requests
fail simultaneously due to token expiration.
