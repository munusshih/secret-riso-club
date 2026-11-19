"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./page.module.css";

export function ScrollBlocks() {
  const filterId = `vertical-blur-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const verticalBlur = useRef<SVGFEGaussianBlurElement>(null);
  const blocks = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = blocks.current;
    const filter = verticalBlur.current;
    if (!element) return;

    let frame = 0;
    let blur = 0;
    let targetBlur = 0;
    let direction = 1;
    let lastInput = 0;
    let previousTime = 0;
    let previousScroll = window.scrollY;
    let previousTouch = 0;

    const paint = () => {
      filter?.setAttribute("stdDeviation", `0 ${blur.toFixed(2)}`);
      element.style.setProperty("--block-drift", `${(-direction * blur * 0.3).toFixed(2)}px`);
    };
    const animate = (time: number) => {
      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;
      // Keep the effect visible between small trackpad events, then ease out.
      if (time - lastInput > 160) targetBlur = 0;
      const smoothing = 1 - Math.exp(-elapsed / (targetBlur ? 45 : 180));
      blur += (targetBlur - blur) * smoothing;
      paint();
      if (targetBlur || blur > 0.04) frame = requestAnimationFrame(animate);
      else {
        blur = 0;
        paint();
        frame = 0;
      }
    };
    const respond = (delta: number) => {
      if (!delta) return;
      direction = Math.sign(delta);
      lastInput = performance.now();
      // A restrained vertical trail that increases with scroll speed.
      targetBlur = Math.min(5.5, 1.5 + Math.abs(delta) * 0.045);
      blur = Math.max(blur, 1.5);
      paint();
      if (!frame) {
        previousTime = lastInput;
        frame = requestAnimationFrame(animate);
      }
    };
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      respond(event.deltaY * unit);
    };
    const onScroll = () => {
      const position = window.scrollY;
      respond(position - previousScroll);
      previousScroll = position;
    };
    const onTouchStart = (event: TouchEvent) => { previousTouch = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => {
      const position = event.touches[0]?.clientY ?? previousTouch;
      respond(previousTouch - position);
      previousTouch = position;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(frame);
      filter?.setAttribute("stdDeviation", "0 0");
      element.style.removeProperty("--block-drift");
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <filter id={filterId} x="-50%" y="-100%" width="200%" height="300%" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur ref={verticalBlur} stdDeviation="0 0" />
          </filter>
        </defs>
      </svg>
      <div ref={blocks} className={styles.blocks} aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <i key={index} style={{ filter: `url(#${filterId})` }} />)}
      </div>
    </>
  );
}
