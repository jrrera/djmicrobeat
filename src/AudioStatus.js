import React, { useState } from "react";
import "./App.css";

const JSON_SOURCE = "http://34.68.79.148:8000/status-json.xsl";

function AudioStatus() {
  const [isStreaming, setStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);

  fetch(JSON_SOURCE)
    .then(res => res.json())
    .then(json => {
      if (json.icestats && json.icestats.source) {
        setStreaming(true);
        // TODO: Fix the source.listenurl field in server config
        setStreamUrl("http://34.68.79.148:8000/techhouse");
      }
    });

  return (
    <>
      <div className="AudioStatus-status">
        Live Stream Status: {isStreaming ? "Online" : "Offline"}
      </div>

      {streamUrl && (
        <audio controls src={streamUrl}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      )}
    </>
  );
}

export default AudioStatus;
