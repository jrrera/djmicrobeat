import React, { useState, useEffect } from "react";
import AudioVisualizer from "./AudioVisualizer";
import fetchStreamMetadata from "../utils/fetchStreamMetadata";
import StreamInfo from "./StreamInfo";
import "../App.css";

const AUDIO_ID = "djstream";

function AudioPlayer() {
  const [isLoading, setLoading] = useState(true);
  const [isStreaming, setStreaming] = useState(false);
  const [streamData, setStreamData] = useState({});

  const dataCallback = json => {
    if (json.icestats && json.icestats.source) {
      const source = json.icestats.source;
      if (Array.isArray(source)) {
        // TODO: Better detection of which stream source
        // to prioritize.
        setStreamData(source[0]);
      } else {
        setStreamData(source);
      }
      setStreaming(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStreamMetadata().then(dataCallback);

    const intervalID = setInterval(
      () => fetchStreamMetadata().then(dataCallback),
      10000
    );

    return () => clearInterval(intervalID);
  }, []);

  return (
    <>
      <div className="AudioPlayer-status">
        {isLoading && <span>..........</span>}
        {!isLoading && !isStreaming && <span>stream status: offline 😴</span>}
      </div>

      {isStreaming && (
        <div className="AudioPlayer-status">
          <StreamInfo streamData={streamData} />
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

export default AudioPlayer;
