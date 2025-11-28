## Auth using localStorage and bearer token in header

- could'nt have `accessToken` as another state in `AuthContext`, as we are updating the localStorage, not the actual `acccestoken`. Use `setUser` (exposed from auth context) instead to trigger AuthContext's re-render through login and logout

1. You come to home page at '/'
2. If you are an authorized user, (checked using user obejct from AuthContext), you access your details and logout button, otherwise you access the login and register options
3. I have a AuthContext responsible for validating the user, it checks whether there's an accessToken in localStorage, if yes it tries to fetch the user using the token at backend route `api/auth/me`, the request is passed with the bearer token in authorization header
4. This route has a middleware, `authMiddleware` that checks for this bearer token, it tries to verify the user using jwt.verify, if the token has expired it gives a 403 error, and if either the header or token is missing, gives a 401 error
5. Further if its valid, it returns the user's info after decoding from the token which is displayed in home
6. Next the home route itself never gets refreshed on token getting expired, rather if the app gets reloaded or on manual reload the token is checked by AuthProvider and the home content is displayed accordingly
7. Now there is another route `/user` in frontend that corresponds to `api/user/welcome` in backend
8. There's a `ProtectedRoutes` component that wraps the `User` element in `/user` route, this component validates the user too, with the same logic as AuthProvider
9. This ProtectedRoutes checks for each route that has nothing to do with backend as well, like for example the user component fetches from `api/user/welcome` which goes through authMiddleware, this authMiddleware is same that forbids invalid tokens. So using this too one can protect the user route, but if it wasnt there, at the frontend level ProtectedRoutes does this job for this user protected route having no interaction with the backend
10. For role based auth i have another `adminMiddleware` that gives a `invalid_role` type error at same 403 status(that is why i had to include type field), and in this admin route at frontend i am trying to fetch from `api/admin/welcome`. if its a `invalid_token` type error (given by `authMiddleware`), we maeke the user object null, clear local storage; but if it was a `invalid_role` type error, we can navigate back to user and not clear the user instead :D
