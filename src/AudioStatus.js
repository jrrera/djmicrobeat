import React, { useState, useEffect } from "react";
import "./App.css";

const JSON_SOURCE = "https://stream.djmicrobeat.com:8443/status-json.xsl";

function AudioStatus() {
  const [isStreaming, setStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);

  useEffect(() => {
    fetch(JSON_SOURCE)
      .then(res => res.json())
      .then(json => {
        if (json.icestats && json.icestats.source) {
          setStreaming(true);
          setStreamUrl(json.icestats.source);
        }
      });
  }, []);

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
