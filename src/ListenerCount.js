import React, { useState, useEffect } from "react";
import fetchStreamMetadata from "./utils/fetchStreamMetadata";

function ListenerCount({ initialListeners, refreshMs = 10000 }) {
  const [numListeners, setListenersCount] = useState(initialListeners);
  const [numPeakListeners, setPeakListenersCount] = useState(null);

  const refreshListeners = () =>
    fetchStreamMetadata().then(json => {
      if (json.icestats && json.icestats.source) {
        setListenersCount(json.icestats.source.listeners);
        setPeakListenersCount(json.icestats.source.listener_peak);
      }
    });

  useEffect(() => {
    const interval = setInterval(refreshListeners, refreshMs);
    return () => clearInterval(interval);
  }, [refreshMs]);

  return (
    <ul>
      {numListeners && <li>Active Listeners: {numListeners} </li>}
      {numPeakListeners && <li>Peak Listeners: {numPeakListeners}</li>}
    </ul>
  );
}

export default ListenerCount;
