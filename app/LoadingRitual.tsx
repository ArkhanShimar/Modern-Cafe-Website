"use client";
import { useEffect, useState } from 'react';

/** Resource progress is real; the short assembly choreography is independent. */
export default function LoadingRitual({ progress, onComplete }: { progress: number; onComplete: () => void }) {
  const [assembled, setAssembled] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAssembled(true), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2400);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (progress < 100 || !assembled) return;
    setLeaving(true);
    const timer = setTimeout(onComplete, 850);
    return () => clearTimeout(timer);
  }, [progress, assembled, onComplete]);
  return <div className={`ritual-loader ${leaving ? 'ritual-leaving' : ''}`} role="status" aria-label={`Preparing LUME. ${progress}% loaded`}>
    <div className="ritual-top"><span className="wordmark">LUME<span>CAFE · SRI LANKA</span></span><span>THE EVERYDAY, REIMAGINED.</span></div>
    <div className="ritual-type" aria-hidden="true">A LITTLE<br /><em>EXTRAORDINARY.</em></div>
    <div className="ritual-stage" aria-hidden="true">
      <div className="ritual-orbit" /><div className="ritual-pour" />
      {[0, 1, 2, 3].map(i => <img key={i} className={`ritual-berry berry-${i}`} src="/strawberry.webp" alt="" />)}
      <img className="ritual-cup silhouette" src="/cup.webp" alt="" />
      <img className="ritual-cup filling" src="/cup.webp" alt="" />
      <span className="ritual-spark spark-one" /><span className="ritual-spark spark-two" />
    </div>
    <div className="ritual-bottom"><span>{assembled ? 'YOUR FIRST SIP AWAITS' : 'FRUIT. CREAM. A LITTLE MAGIC.'}</span><div className="ritual-meter"><i style={{ transform: `scaleX(${progress / 100})` }} /></div><strong>{String(progress).padStart(2, '0')}<small> / 100</small></strong></div>
  </div>;
}
