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

function ListenerInfo({ streamData }) {
  const numListeners = streamData.listeners;
  const numPeakListeners = streamData.listener_peak;
  const trackInfo = {
    artist: streamData.artist,
    title: streamData.title,
    songStr: getSongString(streamData.artist, streamData.title)
  };

  const style = { marginTop: 0, marginBottom: 0 };

  return (
    <>
      {numListeners ? (
        <p style={style}>
          Listeners: {numListeners} ({numPeakListeners} peak)
        </p>
      ) : null}
      <h4 style={style}>{trackInfo.songStr}</h4>
    </>
  );
}

export default ListenerInfo;
