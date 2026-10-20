# useFetch Hook — Task 2

A small React + Vite app that demonstrates a custom hook named **`useFetch`**.
The hook wraps the browser's `fetch` API and returns `data`, `loading` and
`error`, so any component can consume a REST endpoint in one line instead of
re-writing the same `useEffect` + `useState` boilerplate every time.

## Features

- Custom hook `useFetch(url)` returning `{ data, loading, error }`.
- Photo grid fetched from the dummy API
  `https://jsonplaceholder.typicode.com/photos?_limit=40`.
- Dark "Photos" gallery page: 4-column grid of bordered cards, each with a
  coloured 600 x 600 placeholder and the photo title (truncated to one line).
- Loading state: shimmer skeleton cards that keep the layout stable.
- Error state: red "Failed to fetch data." panel with the fetch error message
  and a **Try again** button (shown e.g. when Wi-Fi is turned off).
- Responsive grid (4 → 3 → 2 → 1 column) and `prefers-reduced-motion` support.

## Project Structure

```
UseFetchHook/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Demo page using useFetch
    ├── App.css               # Page / status / grid styles
    ├── index.css             # Global reset + base styles
    ├── hooks/
    │   └── useFetch.js       # The custom hook
    └── components/
        ├── Card.jsx          # Photo card component
        └── Card.css          # Card styles
```

## The Hook

```jsx
const { data, loading, error } = useFetch(url);
```

| Value     | Type             | Meaning                                     |
| --------- | ---------------- | ------------------------------------------- |
| `data`    | `any \| null`    | Parsed JSON response, `null` until it arrives |
| `loading` | `boolean`        | `true` while a request is in flight         |
| `error`   | `string \| null` | Error message, `null` when everything is fine |

## Decisions Made (overview)

1. **Native `fetch` instead of a library** — the assignment asks for the
   `fetch` function of JavaScript, so no axios or react-query was added.
2. **`AbortController` for cleanup** — the effect aborts the in-flight request
   when the component unmounts or the URL changes. This prevents the classic
   "state update on unmounted component" warning and makes sure a slow, stale
   response never overwrites fresh data.
3. **`response.ok` is checked explicitly** — `fetch` only rejects on network
   failures, not on 404/500 responses, so a non-OK status is turned into an
   `Error` manually to keep the `error` value meaningful.
4. **`error` stores a message string (not the raw Error object)** — it can be
   rendered directly in JSX without calling `.toString()` everywhere.
5. **URL kept in `useState` in `App`** — this lets the "Try again" button
   re-point the same hook instance at the endpoint again (with a cache-busting
   param) to retry a failed request without remounting the page.
6. **`options` serialised with `JSON.stringify` for the dependency array** — a
   fresh object literal passed on every render would otherwise trigger an
   infinite refetch loop.
7. **State is reset on each new fetch** (`loading` back to `true`, `error`
   cleared) so the UI always reflects the current request.
8. **`loading` starts as `true`** — there is always a request on first mount
   (when a URL is given), so the UI never flashes "0 items" before data lands.
9. **Colours generated from the photo id** — the dummy API's photo URLs point
   at `picsum.photos` real images, so each card instead gets a stable colour
   derived from its id (`hsl(id * 47 % 360, ...)`). This reproduces the
   coloured "600 x 600" placeholders of the reference design and renders
   instantly with no extra image requests.
10. **Only JSON endpoints are supported** — `response.json()` is called
    directly, which covers the dummy API in the assignment; text/blob APIs
    would need a small extension.

## How to Run

```bash
npm install
npm run dev      # then open http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## Testing (browser)

The page was tested in the browser for all three states:

1. **Loading** — shimmer skeleton cards appear immediately on refresh.
2. **Success** — 40 photo cards render in the grid with the titles returned by
   the API, each with its own colour.
3. **Error** — with the network unavailable (e.g. Wi-Fi turned off) or the API
   unreachable, the red "Failed to fetch data." panel is shown with the error
   message and a "Try again" button that retries the request.
