import { useState } from "react";
import useFetch from "./hooks/useFetch.js";
import Card from "./components/Card.jsx";
import "./App.css";

// Dummy API used by the assignment (JSONPlaceholder - free fake REST API).
const API_URL = "https://jsonplaceholder.typicode.com/photos?_limit=40";

const SKELETONS = [1, 2, 3, 4, 5, 6, 7, 8];

// The dummy API does not ship colours, so each card gets its own stable
// colour derived from its id (same photo always gets the same colour).
const getColor = (id) => `hsl(${(id * 47) % 360}, 72%, 55%)`;

const App = () => {
  // The URL lives in state so the "Try again" button can point useFetch
  // at the same endpoint again (with a cache-busting param) to refetch.
  const [url, setUrl] = useState(API_URL);

  const { data, loading, error } = useFetch(url);

  const photos = Array.isArray(data) ? data : [];

  const retry = () => setUrl(`${API_URL}&t=${Date.now()}`);

  return (
    <div className="app">
      <h1 className="page-title">Photos</h1>

      {/* --- State 1: loading ------------------------------------------ */}
      {loading && (
        <>
          <p className="status status-loading" role="status">
            Loading photos&hellip;
          </p>
          <div className="card-grid" aria-hidden="true">
            {SKELETONS.map((n) => (
              <div className="card skeleton" key={n}>
                <div className="skeleton-image shimmer"></div>
                <div className="skeleton-line shimmer"></div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- State 2: error (e.g. Wi-Fi turned off) -------------------- */}
      {!loading && error && (
        <div className="status status-error" role="alert">
          <strong>Failed to fetch data.</strong>
          <span>{error}</span>
          <button className="retry-btn" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {/* --- State 3: success ------------------------------------------ */}
      {!loading && !error && (
        <div className="card-grid">
          {photos.map((photo) => (
            <Card key={photo.id} color={getColor(photo.id)} title={photo.title} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
