import React, { useState, useEffect } from "react";
import AudioVisualizer from "./AudioVisualizer";
import fetchStreamMetadata from "./utils/fetchStreamMetadata";
import ListenerInfo from "./ListenerInfo";
import "./App.css";

const AUDIO_ID = "djstream";

function AudioStatus() {
  const [isLoading, setLoading] = useState(true);
  const [isStreaming, setStreaming] = useState(false);
  const [streamData, setStreamData] = useState({});
  const [initialListeners, setInitialListeners] = useState(null);

  useEffect(() => {
    fetchStreamMetadata().then(json => {
      if (json.icestats && json.icestats.source) {
        setStreaming(true);
        setStreamData(json.icestats.source);
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

      {isStreaming && (
        <div className="AudioStatus-status">
          <ListenerInfo initialListeners={initialListeners} refreshMs={10000} />
        </div>
      )}

      {streamData.listenurl && (
        <>
          <AudioVisualizer audioID={AUDIO_ID} streamData={streamData} />
        </>
      )}
    </>
  );
}

export default AudioStatus;
