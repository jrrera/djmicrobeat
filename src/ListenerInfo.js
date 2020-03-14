import React, { useState, useEffect, useCallback } from "react";
import fetchStreamMetadata from "./utils/fetchStreamMetadata";

function ListenerInfo({ initialListeners, refreshMs = 10000 }) {
  const [numListeners, setListenersCount] = useState(initialListeners);
  const [numPeakListeners, setPeakListenersCount] = useState(null);
  const [trackInfo, setTrackInfo] = useState({});

  const getSongString = (artist, title) => {
    if (artist && title) {
      return `${artist} - ${title}`;
    }

    if (!artist && title) {
      return title;
    }

    return null;
  };

  const refreshListeners = useCallback(
    () =>
      fetchStreamMetadata().then(json => {
        if (json.icestats && json.icestats.source) {
          const source = json.icestats.source;
          setListenersCount(source.listeners);
          setPeakListenersCount(source.listener_peak);
          setTrackInfo({
            artist: source.artist,
            title: source.title,
            songStr: getSongString(source.artist, source.title)
          });
        }
      }),
    []
  );

  useEffect(() => {
    refreshListeners();
    const interval = setInterval(refreshListeners, refreshMs);
    return () => clearInterval(interval);
  }, [refreshMs, refreshListeners]);

  return (
    <>
      <h4 style={{ marginTop: 0 }}>{trackInfo.songStr}</h4>
      {numListeners ? (
        <h5 style={{ marginBottom: 0 }}>Active Listeners: {numListeners}</h5>
      ) : null}
      {numListeners && numPeakListeners ? (
        <h5 style={{ marginTop: 0 }}>Peak Listeners: {numPeakListeners}</h5>
      ) : null}

      {/* <ul>
        {numListeners ? <li>Active Listeners: {numListeners}</li> : null}
        {numPeakListeners ? <li>Peak Listeners: {numPeakListeners}</li> : null}
      </ul> */}
    </>
  );
}

export default ListenerInfo;
