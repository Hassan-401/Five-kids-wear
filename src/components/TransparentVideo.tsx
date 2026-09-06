import { useEffect, useRef } from "react";

/**
 * Plays a muted, looping video on a canvas while knocking out the flat grey
 * "transparency checkerboard" that is baked into the supplied artwork.
 *
 * The checkerboard pixels are neutral (R≈G≈B) and bright, while the teddy is
 * saturated or dark — so a pixel is treated as background only when its colour
 * channels are within `neutralTolerance` of each other AND it is brighter than
 * `brightnessFloor`. Replace this component with a plain <video> as soon as a
 * real alpha-channel (VP9 + alpha) file is available.
 */
export default function TransparentVideo({
  src,
  className = "",
  width = 360,
  height = 640,
  neutralTolerance = 14,
  brightnessFloor = 196,
}: {
  src: string;
  className?: string;
  width?: number;
  height?: number;
  neutralTolerance?: number;
  brightnessFloor?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    void video.play().catch(() => {
      /* autoplay blocked; the canvas simply stays on its last frame */
    });

    let stopped = false;
    let rafId = 0;
    let frameId = 0;

    const draw = () => {
      if (stopped || video.readyState < 2) return schedule();

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = frame.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const max = r > g ? (r > b ? r : b) : g > b ? g : b;
        const min = r < g ? (r < b ? r : b) : g < b ? g : b;

        if (max < brightnessFloor) continue; // dark pixels are always the bear
        const spread = max - min;
        if (spread >= neutralTolerance) continue; // coloured pixels stay opaque

        // Feather the last few units of spread so edges do not look cut out.
        d[i + 3] = spread <= neutralTolerance - 6
          ? 0
          : Math.round(((spread - (neutralTolerance - 6)) / 6) * 255);
      }

      ctx.putImageData(frame, 0, 0);
      schedule();
    };

    // requestVideoFrameCallback keeps the canvas in step with real decoded
    // frames; rAF is the fallback for browsers without it.
    type WithRVFC = HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: () => void) => number;
      cancelVideoFrameCallback?: (id: number) => void;
    };
    const v = video as WithRVFC;

    function schedule() {
      if (stopped) return;
      if (v.requestVideoFrameCallback) frameId = v.requestVideoFrameCallback(draw);
      else rafId = window.requestAnimationFrame(draw);
    }

    schedule();

    return () => {
      stopped = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (frameId && v.cancelVideoFrameCallback) v.cancelVideoFrameCallback(frameId);
    };
  }, [brightnessFloor, neutralTolerance]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        aria-hidden="true"
        className={className}
      />
    </>
  );
}
