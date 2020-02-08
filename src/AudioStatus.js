import React, { useState, useEffect } from "react";
import fetchStreamMetadata from "./utils/fetchStreamMetadata";
import ListenerCount from "./ListenerCount";
import "./App.css";

function AudioStatus() {
  const [isLoading, setLoading] = useState(true);
  const [isStreaming, setStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [initialListeners, setInitialListeners] = useState(null);

  useEffect(() => {
    fetchStreamMetadata().then(json => {
      if (json.icestats && json.icestats.source) {
        setStreaming(true);
        setStreamUrl(json.icestats.source.listenurl);
        setInitialListeners(json.icestats.source.listeners);
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className="AudioStatus-status">
        <span>Live Stream Status: </span>
        {isLoading && <span>..........</span>}
        {!isLoading && isStreaming && <span>Online</span>}
        {!isLoading && !isStreaming && <span>Offline</span>}
      </div>

      {streamUrl && (
        <audio controls src={streamUrl}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      )}

      {isStreaming && (
        <div className="AudioStatus-status">
          <ListenerCount
            initialListeners={initialListeners}
            refreshMs={10000}
          />
        </div>
      )}
    </>
  );
}

export default AudioStatus;
