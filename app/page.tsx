"use client";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ChevronLeft, ChevronRight, Plus, Minus, Sun, Moon, ShoppingBag, MapPin, Clock, Copy, Check, Trash2, Play, Pause } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { SceneState } from './World';
import CafeMenu from './CafeMenu';
import LoadingRitual from './LoadingRitual';
import CraftStory from './CraftStory';
import IngredientScene from './IngredientScene';
import { useJourney } from './use-journey';
import { cafe, chapters, flavours, menu, rupees, type Bag, type MenuItem } from './cafe-data';
const World = lazy(() => import('./World'));

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState>({ progress: 0, flavour: 0, reduced: false, light: false });
  const [flavour, setFlavour] = useState(0), [chapter, setChapter] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [motion, setMotion] = useState(true);
  const [loading, setLoading] = useState(0), [ready, setReady] = useState(false);
  const [modal, setModal] = useState<'order' | 'visit' | null>(null);
  const [bag, setBag] = useState<Bag>({}), [storageReady, setStorageReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null), [copied, setCopied] = useState(false), [copyFallback, setCopyFallback] = useState('');
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null), pointerStart = useRef<number | null>(null);
  const onProgress = useCallback((value: number) => setLoading(value), []);
  const { go, lenis } = useJourney(root, state, setChapter);
  useEffect(() => { state.current.flavour = flavour; }, [flavour]);
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
    setMotion(document.documentElement.dataset.motion !== 'reduced');
    try { const saved: unknown = JSON.parse(localStorage.getItem('lume-bag') || '{}'); if (saved && typeof saved === 'object') { const valid: Bag = {}; for (const item of menu) { const count = (saved as Bag)[item.id]; if (Number.isInteger(count) && count > 0 && count <= 10) valid[item.id] = count; } setBag(valid); } } catch { /* Storage is optional. */ }
    setStorageReady(true);
    return () => { if (addedTimer.current) clearTimeout(addedTimer.current); };
  }, []);
  useEffect(() => { state.current.light = theme === 'light'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('lume-theme', theme); } catch {} }, [theme]);
  useEffect(() => { state.current.reduced = !motion; document.documentElement.dataset.motion = motion ? 'full' : 'reduced'; if (lenis.current) lenis.current.options.smoothWheel = motion; try { localStorage.setItem('lume-motion', motion ? 'full' : 'reduced'); } catch {} }, [motion, lenis]);
  useEffect(() => { if (storageReady) { try { localStorage.setItem('lume-bag', JSON.stringify(bag)); } catch {} } setCopied(false); setCopyFallback(''); }, [bag, storageReady]);
  const finishLoading = useCallback(() => setReady(true), []);
  useEffect(() => { if (modal || !ready) lenis.current?.stop(); else lenis.current?.start(); }, [modal, ready, lenis]);
  const changeFlavour = (value: number) => setFlavour((value + flavours.length) % flavours.length);
  const add = (item: MenuItem) => { setBag(previous => ({ ...previous, [item.id]: Math.min(10, (previous[item.id] || 0) + 1) })); setLastAdded(item.id); if (addedTimer.current) clearTimeout(addedTimer.current); addedTimer.current = setTimeout(() => setLastAdded(null), 2400); };
  const quantity = (id: string, delta: number) => setBag(previous => { const next = { ...previous }; next[id] = Math.min(10, Math.max(0, (next[id] || 0) + delta)); if (!next[id]) delete next[id]; return next; });
  const selected = menu.filter(item => bag[item.id]);
  const count = selected.reduce((sum, item) => sum + bag[item.id], 0);
  const total = selected.reduce((sum, item) => sum + bag[item.id] * item.price, 0);
  const copyOrder = async () => { const text = `LUME CAFE · My café order\n\n${selected.map(item => `${bag[item.id]} × ${item.name} — ${rupees(bag[item.id] * item.price)}`).join('\n')}\n\nTotal: ${rupees(total)}\nFor ordering at the café; not an online order.`; try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopyFallback(text); } };
  const current = flavours[flavour];
  const customStyle = { '--accent-dark': current.accent, '--accent-light': current.lightAccent, '--glow-rgb': current.glow } as React.CSSProperties;
  return <div ref={root} className={`journey phase-${chapter} flavour-${flavour} ${ready ? 'is-ready' : ''}`} style={customStyle}>
    <a className="skip-link" href="#menu" onClick={event => { event.preventDefault(); go(4); }}>Skip to menu</a>
    <div className="experience" inert={!ready}>
      <div className="atmosphere" aria-hidden="true"><div className="flavour-glow" /></div>
      <div className="craft-photo" aria-hidden="true"><img src="/story-craft.webp" alt="" /></div>
      <div className="interior-layer evening-environment" aria-hidden="true"><div className="cafe-camera"><img src="/interior.webp" alt="" /></div><div className="evening-shade" /></div>
      <div className="finale-environment" aria-hidden="true"><img src="/finale-flatlay.webp" alt="" /><div className="finale-shade" /><div className="finale-light" /></div>
      <Suspense fallback={null}><World state={state} onProgress={onProgress} /></Suspense>
      <div className="reading-shade" aria-hidden="true" />
      <header className="nav">
        <a className="wordmark" href="#home" aria-label="LUME CAFE home" onClick={event => { event.preventDefault(); go(0); }}>LUME<span>CAFE · SRI LANKA</span></a>
        <nav aria-label="Main navigation"><a href="#menu" onClick={event => { event.preventDefault(); go(4); }}>Menu</a><a className="desktop-link" href="#craft" onClick={event => { event.preventDefault(); go(3); }}>Our story</a><a className="desktop-link" href="#cafe" onClick={event => { event.preventDefault(); go(5); }}>The café</a></nav>
        <div className="nav-actions"><button className="motion-toggle" aria-label={motion ? 'Pause animations' : 'Enable animations'} title={motion ? 'Pause animations' : 'Enable animations'} aria-pressed={motion} onClick={() => setMotion(value => !value)}>{motion ? <Pause size={15} /> : <Play size={15} />}<span>{motion ? 'MOTION ON' : 'MOTION OFF'}</span></button><button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`${theme === 'dark' ? 'Light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button><button className="order-button" aria-label={`Your order, ${count} items`} onClick={() => setModal('order')}><ShoppingBag size={16} /><span>Your order</span><b>{count || <ArrowUpRight size={15} />}</b></button></div>
      </header>

      <section className="scene scene-hero" id="home" aria-label="Welcome to LUME">
        <div className="hero-copy"><div className="eyebrow"><span className="tiny-line" /> COLOMBO, SRI LANKA</div><h1>CRAFTED<br />TO <em>CRAVE.</em></h1><p>From your first coffee to your last little bite.<br />Good things happen at LUME.</p><div className="hero-actions"><button className="primary" onClick={() => go(1)}>Explore the flavour <ArrowUpRight size={18} /></button><button className="text-link" onClick={() => go(4)}>View our menu</button></div><div className="hero-footnote">COFFEE. GOOD FOOD. A MOMENT FOR YOU.</div></div>
        <div className="hero-product-note"><span>THE LUME SIGNATURE</span><strong>{current.name}</strong><span>{rupees(current.price)} <i> / </i> BLENDED WITH FEELING</span></div>
        <div className="hero-orbit-note" aria-hidden="true">A LITTLE<br /><em>extraordinary.</em></div>
      </section>
      <section className="scene ingredient-scene" aria-label="Explore what goes into your drink">
        <IngredientScene flavour={flavour} onFlavour={changeFlavour} />
      </section>
      <section className="scene flavour-scene" id="flavours" aria-label="Choose a signature flavour" onPointerDown={event => { if (!(event.target as HTMLElement).closest('button')) pointerStart.current = event.clientX; }} onPointerUp={event => { if (pointerStart.current !== null && Math.abs(event.clientX - pointerStart.current) > 55) changeFlavour(flavour + (event.clientX < pointerStart.current ? 1 : -1)); pointerStart.current = null; }} onPointerCancel={() => pointerStart.current = null}>
        <div className="scene-copy"><div className="eyebrow">THREE SIGNATURES. YOUR KIND OF JOY.</div><h2>FOLLOW<br />YOUR <em>CRAVING.</em></h2><div className="flavour-detail" key={flavour}><span className="eyebrow">{current.tag}</span><h3>{current.name}</h3><p>{current.note}</p></div><div className="flavour-controls"><button className="round-control" aria-label="Previous flavour" onClick={() => changeFlavour(flavour - 1)}><ChevronLeft size={19} /></button>{flavours.map((f, index) => <button key={f.id} className={`swatch ${index === flavour ? 'selected' : ''}`} style={{ '--swatch': f.accent } as React.CSSProperties} aria-label={f.name} aria-pressed={index === flavour} onClick={() => changeFlavour(index)} />)}<button className="round-control" aria-label="Next flavour" onClick={() => changeFlavour(flavour + 1)}><ChevronRight size={19} /></button></div><button className="text-link flavour-add" onClick={() => add(menu.find(item => item.id === current.id)!)}>Add to your order <span>{rupees(current.price)}</span><Plus size={15} /></button><small>SWIPE TO DISCOVER · 0{flavour + 1} / 03</small></div>
      </section>
      <section className="scene craft-scene" id="craft" aria-label="Our story">
        <CraftStory active={chapter === 3 && motion} />
      </section>
      <section className="scene menu-scene" id="menu" aria-label="Our café menu">
        <div className="menu-intro"><span className="eyebrow">FROM FIRST COFFEE TO ONE MORE BITE</span><h2>MORE THAN<br /><em>YOUR USUAL.</em></h2><p>Something for slow mornings,<br />long afternoons, and every craving between.</p><img src="/menu-table.webp" alt="Flat white, croissant, chicken sourdough, chocolate cake and iced matcha" /><span className="menu-photo-caption">GOOD TOGETHER. EVEN BETTER WITH YOU.</span></div>
        <CafeMenu onAdd={add} lastAdded={lastAdded} />
      </section>
      <section className="scene cafe-scene" id="cafe" aria-label="Our Colombo café">
        <div className="space-kicker"><span className="eyebrow">THE LUME ADDRESS / COLOMBO 07</span><span>A slower side of the city.</span></div>
        <div className="space-title"><h2>Somewhere<br />to <em>slow down.</em></h2></div>
        <div className="space-details"><p>Sunlit corners. Unhurried conversations.<br />A little room to be yourself.</p><div><span>{cafe.days}</span><strong>{cafe.hours}</strong></div><button className="text-link" onClick={() => setModal('visit')}>Explore the café <ArrowUpRight size={18} /></button></div>
        <button className="space-next" onClick={() => go(6)} aria-label="Continue to your daily ritual"><span>YOUR MOMENT<br />IS WAITING</span><ArrowDown size={24} /></button>
      </section>
      <section className="scene final-scene" aria-label="Visit LUME">
        <div className="ritual-seal" aria-hidden="true">GOOD COFFEE.<span>GOOD COMPANY.</span></div>
        <div className="final-copy"><span className="eyebrow">A LITTLE EVERYDAY EXTRAORDINARY</span><h2>See you<br />at <em>LUME.</em></h2><p>Your usual. Or something new.<br />We’ll save you a little moment.</p><div className="final-actions"><button className="primary" onClick={() => setModal('visit')}>Find your LUME <ArrowUpRight size={17} /></button><button className="text-link" onClick={() => go(4)}>Explore the menu <ArrowUpRight size={16} /></button></div></div><footer><a href="#home" onClick={event => { event.preventDefault(); go(0); }}>LUME CAFE</a><span>COLOMBO · SRI LANKA</span><span>© {new Date().getFullYear()} LUME</span><button onClick={() => go(0)}>Back to the first sip ↑</button></footer>
      </section>
      <div className="bottom-bar"><button onClick={() => go(chapter === 6 ? 0 : chapter + 1)}>{chapter === 6 ? 'BACK TO THE FIRST SIP' : 'SCROLL TO SAVOUR'} <ArrowDown size={14} /></button><span>0{chapter + 1} <i>/</i> {chapters[chapter]}</span><nav aria-label="Journey chapters" className="chapter-dots">{chapters.map((c, i) => <button key={c} title={c} aria-label={`Go to ${c}`} aria-current={chapter === i ? 'step' : undefined} className={chapter === i ? 'active' : ''} onClick={() => go(i)}><span>{c}</span></button>)}</nav></div>
      <div className="progress-line" />
      <div className={`bag-notice ${lastAdded ? 'show' : ''}`} role="status" aria-live="polite">{lastAdded && <><Check size={15} /><span>{menu.find(item => item.id === lastAdded)?.name} added</span><button onClick={() => setModal('order')}>View order <ArrowUpRight size={13} /></button></>}</div>
    </div>

    {!ready && <LoadingRitual progress={loading} onComplete={finishLoading} />}

    <Dialog open={modal !== null} onOpenChange={open => { if (!open) setModal(null); }}>
      <DialogContent className={`lume-dialog ${modal === 'visit' ? 'visit-dialog' : ''}`} data-lenis-prevent>
        <DialogTitle>{modal === 'visit' ? 'A little LUME in Colombo.' : 'Your café order.'}</DialogTitle>
        <DialogDescription>{modal === 'visit' ? 'Coffee, comfort, and a seat with your name on it.' : 'Your favourites, ready for your next visit.'}</DialogDescription>
        {modal === 'visit' ? <div className="visit-content"><img src="/interior.webp" alt="Warm café interior with timber, tropical greenery and rattan seating" /><div className="visit-details"><div><MapPin size={18} /><p><strong>{cafe.neighbourhood}</strong><span>{cafe.country}</span></p></div><div><Clock size={18} /><p><strong>{cafe.hours}</strong><span>{cafe.days}</span></p></div></div><p className="visit-note">Drop in for a coffee, make it a long lunch, or find a quiet spot for something sweet.</p><a className="primary" href={cafe.mapUrl} target="_blank" rel="noopener noreferrer">Explore Colombo 07 <ArrowUpRight size={16} /></a></div> : <div className="bag-content">
          {selected.length ? <><div className="bag-items">{selected.map(item => <article className="bag-item" key={item.id}><div><h3>{item.name}</h3><span>{rupees(item.price)} each</span></div><div className="quantity"><button aria-label={`Remove one ${item.name}`} onClick={() => quantity(item.id, -1)}>{bag[item.id] === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button><span>{bag[item.id]}</span><button disabled={bag[item.id] >= 10} aria-label={`Add one ${item.name}`} onClick={() => quantity(item.id, 1)}><Plus size={14} /></button></div><strong>{rupees(item.price * bag[item.id])}</strong></article>)}</div><div className="bag-total"><span>Your total</span><strong>{rupees(total)}</strong></div><button className="primary copy-order" onClick={copyOrder}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Order copied' : 'Copy your order'}</button>{copyFallback && <textarea aria-label="Order text to copy" readOnly value={copyFallback} onFocus={event => event.target.select()} /> }<p className="order-note">Save your list and order at the café. Online checkout isn’t available yet; no order has been sent.</p><button className="text-link" onClick={() => { setModal(null); go(4); }}>Something else? Back to the menu <ArrowUpRight size={16} /></button></> : <div className="empty-bag"><ShoppingBag size={35} strokeWidth={1} /><h3>What are you craving?</h3><p>Find a coffee, a little bite, or your new favourite.</p><button className="primary" onClick={() => { setModal(null); go(4); }}>Explore our menu <ArrowUpRight size={16} /></button></div>}
        </div>}
      </DialogContent>
    </Dialog>
  </div>;
}
