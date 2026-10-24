"use client";
import { useState } from 'react';
import { Plus, Check, ArrowUpRight, Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categories, menu, rupees, type MenuItem, type Category } from './cafe-data';
const collections: Record<Category, { title: string; note: string; item: string; position: string }> = {
  Coffee: { title: 'THE MORNING\nRITUAL.', note: 'BOLD ESPRESSO. VELVET FINISH.', item: 'flat-white', position: '12% 46%' },
  'Frappés': { title: 'A LITTLE\nEXTRA.', note: 'OUR SIGNATURE KIND OF COLD.', item: 'strawberry', position: 'center' },
  'Tea & coolers': { title: 'ISLAND\nREFRESH.', note: 'SLOW BREWED. ICE COLD.', item: 'matcha', position: '91% 30%' },
  Breakfast: { title: 'STAY FOR\nA BITE.', note: 'GOOD MORNINGS, ALL DAY.', item: 'chicken', position: '57% 58%' },
  Bakes: { title: 'ONE MORE\nLITTLE BITE.', note: 'BUTTERY LAYERS. SWEET ENDINGS.', item: 'croissant', position: '30% 58%' },
};
export default function CafeMenu({ onAdd, lastAdded }: { onAdd: (item: MenuItem) => void; lastAdded: string | null }) {
  const [category, setCategory] = useState<Category>('Coffee');
  const [featured, setFeatured] = useState('flat-white');
  const [query, setQuery] = useState('');
  const matches = menu.filter(item => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const collection = collections[category], item = menu.find(entry => entry.id === featured)!;
  const isFrappe = category === 'Frappés';
  const image = isFrappe ? ({ caramel: '/caramel.webp', mocha: '/mocha.webp' }[item.id] || '/cup.webp') : '/menu-table.webp';
  return <Tabs value={category} onValueChange={value => { setCategory(value as Category); setFeatured(collections[value as Category].item); setQuery(''); }} className="cafe-menu">
    <div className="menu-showcase" onPointerMove={event => { if (event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--tilt', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 9}deg`); }} onPointerLeave={event => event.currentTarget.style.setProperty('--tilt', '0deg')}>
      <div className="collection-caption"><span className="eyebrow">THE LUME COLLECTION / 0{categories.indexOf(category) + 1}</span><h3 key={category}>{collection.title}</h3></div>
      <div className={`menu-portal ${isFrappe ? 'portal-frappe' : ''}`}><div className="portal-halo" /><img key={image + category} src={image} alt={isFrappe ? item.name : 'Coffee, pastries, sourdough and iced matcha'} style={{ objectPosition: collection.position }} /><span className="portal-caption">{collection.note}</span></div>
      <button className="featured-pick" onClick={() => onAdd(item)}><span><small>{isFrappe ? 'YOUR SIGNATURE' : 'OUR PICK FOR YOU'}</small><strong>{item.name}</strong></span><span>{rupees(item.price)} <ArrowUpRight size={19} /></span></button>
    </div>
    <div className="menu-selection">
    <div className="menu-search"><Search size={15} /><input aria-label="Search the café menu" placeholder="Find your next favourite…" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setQuery(''); }} />{query && <button onClick={() => setQuery('')} aria-label="Clear menu search"><X size={16} /></button>}</div>
    <div className="menu-tabs-scroll"><TabsList variant="line" aria-label="Menu categories" className="menu-tabs">{categories.map(cat => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}</TabsList></div>
    <div className="menu-list-label"><span aria-live="polite">{query.trim() ? `${matches.length} MATCHES ACROSS THE MENU` : category === 'Breakfast' ? 'SOMETHING GOOD, ALL DAY' : category === 'Bakes' ? 'A LITTLE SOMETHING SWEET' : 'MADE FOR YOUR EVERYDAY'}</span><span>LKR</span></div>
    {categories.map(cat => <TabsContent className="menu-items" value={cat} key={cat} data-lenis-prevent>
      {(query.trim() ? matches : menu.filter(item => item.category === cat)).map((item, index) => <article className={`menu-item ${item.id === featured ? 'is-featured' : ''}`} key={item.id} onFocus={() => { if (cat === 'Frappés' && item.category === cat && item.id !== 'vanilla') setFeatured(item.id); }} onMouseEnter={() => { if (cat === 'Frappés' && item.category === cat && item.id !== 'vanilla') setFeatured(item.id); }} style={{ '--item-index': index } as React.CSSProperties}>
        <span className="menu-item-number">0{index + 1}</span><div className="menu-item-copy"><h3>{item.name}{item.badge && <span>{item.badge}</span>}</h3><p>{item.description}</p></div>
        <span className="menu-price">{rupees(item.price)}</span>
        <button className={`add-item ${lastAdded === item.id ? 'added' : ''}`} aria-label={`Add ${item.name} to order`} onClick={() => onAdd(item)}>{lastAdded === item.id ? <Check size={16} /> : <Plus size={16} />}</button>
      </article>)}
      {query.trim() && !matches.length && <div className="menu-empty"><h3>A different craving?</h3><p>Try coffee, chocolate, tea or something buttery.</p><button className="text-link" onClick={() => setQuery('')}>Browse the menu <ArrowUpRight size={16} /></button></div>}
    </TabsContent>)}
    <p className="menu-note">All prices in Sri Lankan rupees. Please ask our team about allergens.</p>
    </div>
  </Tabs>;
}
