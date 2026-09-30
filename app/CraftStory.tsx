"use client";
import { useEffect, useState } from 'react';
const moments = [
  { time: '01 / THE ROOTS', title: 'An island.\nAn inspiration.', copy: 'The warmth of Colombo. The comfort of Ceylon tea. Familiar flavours, seen in a fresh light.', detail: 'COLOMBO · SRI LANKA', word: 'ROOTED' },
  { time: '02 / THE CRAFT', title: 'Good things\ntake a moment.', copy: 'Espresso pulled with care. Milk textured until silky. Fresh ingredients brought together, one cup at a time.', detail: 'GRIND · EXTRACT · TEXTURE', word: 'CRAFTED' },
  { time: '03 / THE POUR', title: 'A little more\nthan expected.', copy: 'A ribbon of caramel. A cloud of cream. That first cold sip on a warm island afternoon.', detail: 'POUR · FINISH · SAVOUR', word: 'POURED' },
  { time: '04 / YOUR RITUAL', title: 'Make room\nfor your moment.', copy: 'The morning regular. The catch-up that runs long. A table, a good cup, and a reason to stay.', detail: 'YOUR CUP · YOUR PACE', word: 'YOURS' },
];
export default function CraftStory({ active }: { active: boolean }) {
  const [moment, setMoment] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!active || paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setMoment(value => (value + 1) % moments.length), 5500);
    return () => clearInterval(timer);
  }, [active, paused]);
  const current = moments[moment];
  return <div className="craft-journey">
    <div className="craft-heading"><span className="eyebrow">NOT JUST COFFEE. A SMALL DAILY OBSESSION.</span><h2>ISLAND SOUL.<br /><em>FUTURE RITUALS.</em></h2></div>
    <button className="story-playback" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play story timeline' : 'Pause story timeline'}>{paused ? 'PLAY STORY' : 'PAUSE STORY'}<span>{paused ? '▶' : 'Ⅱ'}</span></button>
    <div className="craft-lens" aria-hidden="true"><img src="/menu-table.webp" alt="" /><div className="lens-ring" /><span key={current.word}>{current.word}</span><small>6.9271° N &nbsp; 79.8612° E</small></div>
    <div className="craft-moment" key={moment}><span className="eyebrow">{current.time}</span><h3>{current.title}</h3><p>{current.copy}</p><small>{current.detail}</small></div>
    <nav className="craft-timeline" aria-label="Our story timeline">{moments.map((item, i) => <button key={item.word} className={moment === i ? 'current' : ''} aria-pressed={moment === i} onClick={() => { setMoment(i); setPaused(true); }}><span className="timeline-node">0{i + 1}</span><span>{['Island roots', 'The craft', 'The pour', 'Your moment'][i]}</span>{moment === i && active && !paused && <i key={`${moment}-${active}`} />}</button>)}</nav>
  </div>;
}
