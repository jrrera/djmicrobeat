import React, { useEffect, useRef } from "react";
import "../App.css";

// https://www.kkhaydarov.com/audio-visualizer/
const initVisualizer = audio => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const context = new AudioCtx();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const canvas = document.getElementById("renderer");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = 300;

  function animationLooper(animationRef) {
    const bars = 100;
    const barWidth = 2;
    const radius = 75;
    const rads = (Math.PI * 2) / bars; //divide a circle into equal parts

    // find the center of the window
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // style the background
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
    gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw a circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    analyser.getByteFrequencyData(dataArray);
    for (var i = 0; i < bars; i++) {
      const barHeight = dataArray[i] * 0.35;

      // set coordinates
      const x = centerX + Math.cos(rads * i) * radius;
      const y = centerY + Math.sin(rads * i) * radius;
      const xEnd = centerX + Math.cos(rads * i) * (radius + barHeight);
      const yEnd = centerY + Math.sin(rads * i) * (radius + barHeight);

      //draw a bar
      drawBar(x, y, xEnd, yEnd, barWidth, dataArray[i]);
    }
    animationRef.current = requestAnimationFrame(() =>
      animationLooper(animationRef)
    );
  }

  // for drawing a bar
  function drawBar(x1, y1, x2, y2, width, frequency) {
    var lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  return { animationLooper };
};

function AudioVisualizer({ audioID, streamData }) {
  // Hacky workaround for Icecast returning the http version of the stream,
  // rather than https. Chrome version 80 automatically changes url to https,
  // which breaks due to non-standard ports 8000 and 8443.
  const listenUrl = streamData.listenurl.replace(
    "http://stream.djmicrobeat.com:8000",
    "https://stream.djmicrobeat.com:8443"
  );

  const audioElemRef = useRef();
  const animationRef = useRef();
  const checkPlaybackRef = useRef(0);
  useEffect(() => {
    const audio = document.getElementById(audioID);
    audioElemRef.current = audio;

    audio.onplay = () => {
      const { animationLooper } = initVisualizer(audio);
      animationLooper(animationRef);

      // Future play actions shouldn't init again. Only animate.
      audio.onplay = () => animationLooper(animationRef);
    };

    audio.onpause = () => cancelAnimationFrame(animationRef.current);
  }, [audioID]);

  // TODO: Update this interval to detect fallback stream -> live stream,
  // and manually start/stop the audio player.
  useEffect(() => {
    const audio = document.getElementById(audioID);
    var intervalID = setInterval(patchStreamFailure, 1000);
    var oldTime = checkPlaybackRef.current;

    function patchStreamFailure() {
      console.log(
        "checking...",
        audio.paused,
        audio.ended,
        audio.currentTime,
        oldTime
      );
      if (audio.paused && audio.currentTime - oldTime === 0) {
        console.log("failure! resetting!");
        audio.src = "";
        audio.src = listenUrl;
        audio.play();
      }
      oldTime = audio.currentTime;
    }

    return () => clearInterval(intervalID);
  });

  return (
    <div className="AudioPlayerWrapper">
      <audio
        className="AudioPlayer"
        crossOrigin="anonymous"
        id={audioID}
        controls
      >
        <source src={listenUrl} type={streamData.server_type}></source>
        Your browser does not support the <code>audio</code> element.
      </audio>
      <canvas id="renderer"></canvas>
    </div>
  );
}

export default AudioVisualizer;
