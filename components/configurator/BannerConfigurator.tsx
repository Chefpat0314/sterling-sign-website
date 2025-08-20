import React, { useMemo, useState } from 'react';
import { calculatePrice } from '../../lib/pricing/PriceCalculator';

const PRESET_SIZES = [
  { w: 24,  h: 18,  label: '24" x 18"' },
  { w: 36,  h: 24,  label: '36" x 24"' },
  { w: 72,  h: 24,  label: '72" x 24"' },
  { w: 96,  h: 36,  label: '96" x 36"' },
  { w: 120, h: 48,  label: '120" x 48"' }
];

export default function BannerConfigurator({ product }) {
  // core
  const [widthIn, setWidthIn]   = useState(72);
  const [heightIn, setHeightIn] = useState(24);
  const [quantity, setQuantity] = useState(1);

  // # of sides (2x multiplier for double-sided)
  const [sides, setSides] = useState('1'); // '1' | '2'

  // finishing
  const [hems, setHems] = useState(false); // start as "No Hem" to match screenshot
  const [grommets, setGrommets] = useState('every_2ft'); // none | every_2ft | perimeter
  const [pockets, setPockets] = useState('none');        // matches pricing JSON values
  const [windSlits, setWindSlits] = useState(false);

  // service
  const [production, setProduction] = useState('standard'); // standard | rush | same_day
  const [proof, setProof] = useState(false);

  // object we store in cart
  const optionsObj = useMemo(() => ({
    sides,
    hems,
    grommets,
    pole_pockets: pockets,
    wind_slits: windSlits
  }), [sides, hems, grommets, pockets, windSlits]);

  // base price from calculator (does NOT include sides multiplier)
  const base = useMemo(() => calculatePrice(product, {
    widthIn,
    heightIn,
    quantity,
    options: { hems, grommets, pole_pockets: pockets }
  }), [product, widthIn, heightIn, quantity, hems, grommets, pockets]);

  // multipliers/fees
  const sideMultiplier = sides === '2' ? 2 : 1;
  const rushMultiplier = production === 'standard' ? 1 : production === 'rush' ? 1.25 : 1.5;
  const proofFee = proof ? 5 : 0;

  // final price
  const finalUnit  = round2(base.unitPrice * sideMultiplier * rushMultiplier + proofFee);
  const finalTotal = round2(finalUnit * quantity);

  function usePreset(w, h) { setWidthIn(w); setHeightIn(h); }

  function addToCart() {
    const cartKey = 'sss_cart';
    const line = {
      slug: product.slug,
      name: product.name,
      widthIn, heightIn, quantity,
      options: optionsObj,
      service: { production, proof },
      pricing: {
        sqft: base.sqft,
        base: base.base,
        optionsTotal: base.optionsTotal,
        sideMultiplier,
        rushMultiplier,
        proofFee,
        unitPrice: finalUnit,
        quantity,
        lineTotal: finalTotal
      },
      jobName: prompt('Job Name (optional)') || ''
    };
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    cart.push(line);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert('Added to cart.');
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6">
      {/* TOP: two-column layout */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div>
          <div className="aspect-video w-full bg-gray-100 rounded-xl grid place-items-center text-gray-500">
            <span>13oz Vinyl Banner</span>
          </div>
        </div>

        {/* RIGHT: order/configure panel */}
        <div className="border rounded-2xl p-5 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

          {/* Popular sizes */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Popular Sizes</div>
            <div className="flex flex-wrap gap-2">
              {PRESET_SIZES.map(s => (
                <button key={s.label} onClick={() => usePreset(s.w, s.h)}
                        className="px-3 py-1.5 border rounded-full text-sm hover:bg-gray-50">
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size & Qty */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <label className="col-span-1">
              <div className="text-sm font-medium">Width</div>
              <input type="number" min={1} value={widthIn}
                     onChange={(e) => setWidthIn(Number(e.target.value))}
                     className="mt-1 w-full border rounded p-2" />
              <div className="text-xs text-gray-500 mt-1">inches</div>
            </label>
            <label className="col-span-1">
              <div className="text-sm font-medium">Height</div>
              <input type="number" min={1} value={heightIn}
                     onChange={(e) => setHeightIn(Number(e.target.value))}
                     className="mt-1 w-full border rounded p-2" />
              <div className="text-xs text-gray-500 mt-1">inches</div>
            </label>
            <label className="col-span-1">
              <div className="text-sm font-medium">Quantity</div>
              <input type="number" min={1} value={quantity}
                     onChange={(e) => setQuantity(Number(e.target.value))}
                     className="mt-1 w-full border rounded p-2" />
            </label>
          </div>

          {/* # of Sides */}
          <div className="mb-4">
            <div className="text-sm font-medium"># of Sides</div>
            <select
              className="mt-1 border rounded p-2 w-full"
              value={sides}
              onChange={(e) => setSides(e.target.value)}
            >
              <option value="1">1 Side</option>
              <option value="2">2 Sides (2×)</option>
            </select>
          </div>

          {/* Material (read-only row to match the UI) */}
          <div className="mb-4">
            <div className="text-sm font-medium">Material</div>
            <div className="mt-1 border rounded p-2 bg-gray-50">13oz. Matte Vinyl Banner</div>
          </div>

          {/* Finishing */}
          <div className="mb-4 space-y-3">
            <div className="text-sm font-medium">Finishing</div>

            {/* Hem as a dropdown to match "No Hem" style */}
            <div>
              <div className="text-sm font-medium">Hem</div>
              <select
                className="mt-1 border rounded p-2 w-full"
                value={hems ? 'hem' : 'none'}
                onChange={(e) => setHems(e.target.value === 'hem')}
              >
                <option value="none">No Hem</option>
                <option value="hem">Hem All Sides</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-medium">Grommet</div>
              <select className="mt-1 border rounded p-2 w-full"
                      value={grommets}
                      onChange={(e) => setGrommets(e.target.value)}>
                <option value="none">None</option>
                <option value="every_2ft">Every 2' All Sides</option>
                <option value="perimeter">Perimeter</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-medium">Pole Pocket</div>
              <select className="mt-1 border rounded p-2 w-full"
                      value={pockets}
                      onChange={(e) => setPockets(e.target.value)}>
                <option value="none">No Pole Pockets</option>
                <option value="2in_top_bottom">2" - Top and Bottom</option>
                <option value="3in_top_bottom">3" - Top and Bottom</option>
                <option value="4in_top_bottom">4" - Top and Bottom</option>
                <option value="2in_top_only">2" - Top Only</option>
                <option value="3in_top_only">3" - Top Only</option>
                <option value="4in_top_only">4" - Top Only</option>
                <option value="custom">Custom Pole Pocket</option>
              </select>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={windSlits} onChange={(e) => setWindSlits(e.target.checked)} />
              <span>Wind slits</span>
            </label>
          </div>

          {/* Service */}
          <div className="mb-4 space-y-3">
            <div className="text-sm font-medium">Production Time</div>
            <div className="grid grid-cols-3 gap-2">
              <button className={`border rounded p-2 ${production==='standard' ? 'bg-gray-100' : ''}`} onClick={()=>setProduction('standard')}>Next Day</button>
              <button className={`border rounded p-2 ${production==='rush' ? 'bg-gray-100' : ''}`} onClick={()=>setProduction('rush')}>Rush</button>
              <button className={`border rounded p-2 ${production==='same_day' ? 'bg-gray-100' : ''}`} onClick={()=>setProduction('same_day')}>Same Day</button>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={proof} onChange={(e)=>setProof(e.target.checked)} />
              <span>Digital proof (+$5)</span>
            </label>
          </div>

          {/* Price Summary */}
          <div className="border rounded-lg p-4 bg-gray-50 mb-3">
            <div className="flex justify-between text-sm">
              <span>{base.sqft} sqft @ ${product.base_price_per_sqft}/sqft</span>
              <span>Options: ${base.optionsTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sides Multiplier</span>
              <span>{sideMultiplier}x</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Production Multiplier</span>
              <span>{rushMultiplier}x</span>
            </div>
            {proof && (
              <div className="flex justify-between text-sm">
                <span>Proof Fee</span><span>${proofFee}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold mt-2">
              <span>Unit Price</span><span>${finalUnit}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total ({quantity})</span><span>${finalTotal}</span>
            </div>
          </div>

          <button onClick={addToCart} className="w-full bg-black text-white py-3 rounded-lg">Add to Cart</button>
          <p className="text-xs text-gray-500 mt-2">Upload artwork after checkout.</p>
        </div>
      </div>

      {/* ===== BELOW THE ORDER PANEL — ALL YOUR INFO SECTIONS ===== */}
      <div className="mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-2">Next Day Turnaround and Cut-off Time</h2>
          <p className="text-sm text-gray-700">
            Order and submit artwork before <strong>4pm PST</strong> ships next business day. Order after 4pm add 1 business day.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <strong>Orders over 100 qty</strong> require 2 extra business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Same Day Turnaround</h2>
          <p className="text-sm text-gray-700">
            Order and submit artwork before <strong>12pm PST</strong> ships same day.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Available Production Facility</h2>
          <p className="text-sm text-gray-700 mb-2">
            Your orders are dispatched from the closest facility to your ship-to address for speed and savings
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>CA Headquarters</li>
            <li>CA Sign Department</li>
            <li>TX Print Facility</li>
            <li>PA Print Facility</li>
          </ul>
          <p className="text-sm text-gray-600 italic mt-3">
            Store pickup only available in our California locations
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-sm text-gray-700">
            We use a premium heavyweight 13 oz. scrim vinyl banner. This material looks great indoors, but designed to stand up to the elements outdoors. This material is typically used for billboards, building wraps, banners, event flags, trade show signage, parades, and more.
          </p>
          <p className="text-sm text-gray-700 mt-3">
            Standard hems and grommets are no extra charge, and we offer a lineup of finishing options to satisfy specialty applications and city ordinances.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Please Note</h3>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>All banners 89&quot; or larger on their shortest side will be shipped folded.</li>
            <li>All banners 88&quot; and under on their shortest side will be shipped rolled.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Spec</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-1">Features</h4>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                <li>Single-Sided single piece maximum size 10’ x 145’ w/o pocket and 9.5’ x 145’ w/ pocket ; Double-Sided banners maximum size 9.5’ x 145‘</li>
                <li>Oversized banners will be welded together (Double-Sided Banners are not available oversized)</li>
                <li>Indoor and outdoor use, waterproof and UV safe</li>
                <li>Double sided banners are single-ply banner printed front and back</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Material</h4>
              <p className="text-sm text-gray-700">UV Printed 13 oz. Matte Vinyl Banner</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 mt-4 md:mt-0">Print Options</h4>
              <p className="text-sm text-gray-700">Single or Double Sided</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 mt-4 md:mt-0">Optional Materials</h4>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                <li>Number 2 brass grommets (Stimpson)</li>
                <li>White double stitched thread</li>
                <li>1&quot; White Velcro (Loop side attached to banner)</li>
                <li>1&quot; White nylon webbing and silver d-rings</li>
                <li>Clear plastic Banner-ups banner tabs for reinforced corners</li>
                <li>3/16&quot; and 5/16&quot; Sewn in nylon rope</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Optional Finishing</h4>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                <li>Hems and Grommets</li>
                <li>Pole Pockets</li>
                <li>Velcro</li>
                <li>Webbing and D-rings</li>
                <li>Sewn-in Rope</li>
                <li>Windslits</li>
                <li>Reinforced Corners</li>
                <li>Welded oversized banners</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">File Setup</h2>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Accepted File Formats: JPEG or PDF (single page only)</li>
            <li>Color Space: CMYK</li>
            <li>Resolution: 150dpi for raster images</li>
            <li>Max File Upload Size: 300MB</li>
            <li>Submit artwork built to ordered size — Scaled artwork is automatically detected and fit to order</li>
            <li>Do not include crop marks or bleeds</li>
            <li>Double sided products will be uploaded as two separate files unless otherwise specified in the artwork template</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Additional Tips</h2>
          <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
            <li>Do not submit with Pantones/Spot Colors — Convert to CMYK</li>
            <li>Convert live fonts to outlines</li>
            <li>Use provided design templates when available</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function round2(n) { return Math.round(n * 100) / 100; }
