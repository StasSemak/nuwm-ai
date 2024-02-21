App need envirovment valriables to be set up in `.env` file, as in `.env.example`:
- `VITE_BACKEND_URL` - path to the backend server
- `VITE_AUTH_TOKEN` - Bearer auth token

## Development mode
To run, use `npm run dev`. Starts dev server on `localhost:5173`.

## Production mode
At first, build an app, using `npm run build`. This creates folder `dist`, 
where production code is located. To test build, run `npm run preview`. 