"use client";
import { useEffect, useState } from 'react';

/** A photographic reveal: no simulated liquid or invented pour physics. */
export default function LoadingRitual({ progress, onComplete }: { progress: number; onComplete: () => void }) {
  const [assembled, setAssembled] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAssembled(true), document.documentElement.dataset.motion === 'reduced' ? 0 : 2400);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (progress < 100 || !assembled) return;
    setLeaving(true);
    const timer = setTimeout(onComplete, 850);
    return () => clearTimeout(timer);
  }, [progress, assembled, onComplete]);
  return <div className={`ritual-loader photographic-intro ${leaving ? 'ritual-leaving' : ''}`} role="status" aria-label={`Preparing LUME. ${progress}% loaded`}>
    <div className="ritual-top"><span className="wordmark">LUME<span>CAFE · SRI LANKA</span></span><span>THE EVERYDAY, REIMAGINED.</span></div>
    <div className="intro-photograph" aria-hidden="true"><img src="/story-craft.webp" alt="" /><div /></div>
    <div className="intro-title"><span>THE LUME RITUAL</span><h2>GOOD THINGS.<br /><em>MADE SLOWLY.</em></h2><p>One moment. One cup. All yours.</p></div>
    <div className="ritual-bottom"><span>{assembled ? 'YOUR FIRST SIP AWAITS' : 'SETTING THE MOOD'}</span><div className="ritual-meter"><i style={{ transform: `scaleX(${progress / 100})` }} /></div><strong>{String(progress).padStart(2, '0')}<small> / 100</small></strong></div>
  </div>;
}
