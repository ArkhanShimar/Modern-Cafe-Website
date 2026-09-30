"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { SceneState } from './World';

export function useJourney(root: React.RefObject<HTMLDivElement | null>, state: React.RefObject<SceneState>, onChapter: (chapter: number) => void) {
  const lenis = useRef<Lenis | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    state.current.reduced = media.matches;
    const smooth = new Lenis({ duration: 1.08, smoothWheel: !media.matches, syncTouch: false, anchors: false });
    lenis.current = smooth;
    smooth.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => smooth.raf(time * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const panels = Array.from(root.current!.querySelectorAll<HTMLElement>('.scene'));
    const atmosphere = root.current!.querySelector<HTMLElement>('.atmosphere')!;
    const interior = root.current!.querySelector<HTMLElement>('.interior-layer')!;
    const table = root.current!.querySelector<HTMLElement>('.craft-photo')!;
    let chapter = -1;
    const update = (progress: number) => {
      state.current.progress = progress;
      const p = progress * 6, next = Math.round(p);
      if (next !== chapter) { chapter = next; onChapter(next); }
      panels.forEach((panel, index) => {
        const distance = p - index;
        // Keep the world continuous, but never put two chapters of text on top
        // of one another during a transition.
        const fade = Math.min(1, Math.max(0, (Math.abs(distance) - .15) / .33));
        const opacity = 1 - fade * fade * (3 - 2 * fade);
        panel.style.opacity = String(opacity);
        panel.style.visibility = opacity > .01 ? 'visible' : 'hidden';
        panel.style.pointerEvents = Math.abs(distance) < .42 ? 'auto' : 'none';
        panel.style.transform = state.current.reduced ? 'none' : `perspective(1200px) translate3d(0,${-distance * 70}px,${-Math.abs(distance) * 90}px)`;
        panel.inert = Math.abs(distance) >= .42;
      });
      const cafe = Math.max(0, 1 - Math.abs(p - 5) * 1.2);
      interior.style.opacity = String(cafe);
      interior.style.transform = `scale(${1.035 + (p - 5) * .015})`;
      table.style.opacity = String(Math.max(0, 1 - Math.abs(p - 3) * 1.35));
      table.style.transform = `translate3d(${(p - 3) * -25}px,0,0) scale(${1.025 + (p - 3) * .015})`;
      atmosphere.style.opacity = String(1 - Math.max(0, 1 - Math.abs(p - 4)) * .6);
      root.current?.style.setProperty('--progress', String(progress));
    };
    const trigger = ScrollTrigger.create({ trigger: root.current, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true, onUpdate: self => update(self.progress), onRefresh: self => update(self.progress) });
    triggerRef.current = trigger; update(trigger.progress);
    const preference = () => { state.current.reduced = media.matches; smooth.options.smoothWheel = !media.matches; };
    media.addEventListener('change', preference);
    return () => { media.removeEventListener('change', preference); trigger.kill(); smooth.destroy(); gsap.ticker.remove(tick); };
  }, [root, state, onChapter]);
  const go = (chapter: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    lenis.current?.scrollTo(trigger.start + (trigger.end - trigger.start) * chapter / 6, { duration: state.current.reduced ? 0 : 1.25, force: true });
  };
  return { go, lenis };
}
