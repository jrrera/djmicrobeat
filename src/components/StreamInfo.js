import React from "react";

const getSongString = (artist, title) => {
  if (artist && title) {
    return `${artist} - ${title}`;
  }

  if (!artist && title) {
    return title;
  }

  return null;
};

function StreamInfo({ streamData }) {
  const numListeners = streamData.listeners;
  const numPeakListeners = streamData.listener_peak;
  const streamTitle = streamData.server_name;
  const isValidTitle = streamTitle != null && streamTitle !== "no name";

  // TODO: Use a better styling mechanism.
  const style = { marginTop: 0, marginBottom: 0 };
  const listenersStyle = { marginTop: -5 };

  return (
    <>
      {numListeners ? (
        <p style={listenersStyle}>
          live listeners: {numListeners} ({numPeakListeners} peak)
        </p>
      ) : null}
      <p style={style}>
        {isValidTitle ? streamTitle : "stream status: online 🔥"}
      </p>
      <h4 style={style}>
        {getSongString(streamData.artist, streamData.title)}
      </h4>
    </>
  );
}

export default StreamInfo;
