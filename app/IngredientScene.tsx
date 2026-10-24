"use client";
import { useState } from 'react';
import { flavours } from './cafe-data';

const flavourIngredients = [
  { title: 'Real strawberries', copy: 'Blended fruit brings the bright berry flavour, natural colour and a little tartness that balances the cream.', note: 'BRIGHT, FRUITY & A LITTLE TART' },
  { title: 'Caramel & espresso', copy: 'Golden caramel brings a buttery sweetness. Espresso gives the blend its rounded, roasted depth.', note: 'GOLDEN SWEETNESS, ROASTED DEPTH' },
  { title: 'Chocolate & espresso', copy: 'Chocolate adds a deep cocoa flavour; espresso brings a gently bitter edge to balance the sweetness.', note: 'DEEP COCOA, A BOLD FINISH' },
];
export default function IngredientScene({ flavour, onFlavour }: { flavour: number; onFlavour: (index: number) => void }) {
  const [selected, setSelected] = useState(0);
  const featured = flavourIngredients[flavour];
  const ingredients = [
    featured,
    { title: 'Fresh milk', copy: 'The creamy foundation. Milk brings everything together with a smooth texture that lets the main flavour shine.', note: 'THE SMOOTH, CREAMY FOUNDATION' },
    { title: 'Ice & whipped cream', copy: 'Ice keeps the blend refreshingly cold. A light whipped-cream finish adds that soft, indulgent first sip.', note: 'CHILLED THROUGH, SOFT ON TOP' },
    { title: 'A paper straw', copy: 'A simple alternative to a single-use plastic straw. Please follow local disposal guidance after your last sip.', note: 'A SMALL, CONSIDERED CHOICE' },
  ];
  return <>
    <div className="ingredient-editorial">
      <span className="eyebrow">01 / A CLOSER LOOK AT YOUR CUP</span>
      <h2>GOOD FROM<br /><em>THE INSIDE.</em></h2>
      <div className="recipe-flavours" aria-label="Explore flavour ingredients">{flavours.map((item, index) => <button key={item.id} onClick={() => onFlavour(index)} aria-pressed={index === flavour}>{['Strawberry', 'Caramel', 'Mocha'][index]}</button>)}</div>
      <div className="recipe-list" data-lenis-prevent>{ingredients.map((ingredient, index) => <button key={index} className={selected === index ? 'inspected' : ''} onClick={() => setSelected(index)} aria-expanded={selected === index} aria-controls={`ingredient-detail-${index}`}><span className="recipe-number">0{index + 1}</span><span><strong>{ingredient.title}</strong><span className="recipe-description" id={`ingredient-detail-${index}`} hidden={selected !== index}>{ingredient.copy}</span></span><i>{selected === index ? '−' : '+'}</i></button>)}</div>
      <small className="recipe-note">MADE TO ENJOY. EVERY INGREDIENT HAS A PART.</small>
    </div>
    <div className="ingredient-callouts" aria-label="Drink ingredient hotspots">{ingredients.map((ingredient, index) => <button key={index} className={`ingredient-pin pin-${index} ${selected === index ? 'selected' : ''}`} aria-label={`Inspect ${ingredient.title}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><b>0{index + 1}</b><span>{ingredient.title}</span></button>)}<div className="recipe-product-caption"><span>{flavours[flavour].name}</span><small>{ingredients[selected].note}</small></div></div>
  </>;
}

