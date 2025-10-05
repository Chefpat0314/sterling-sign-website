import React, { useMemo, useState } from 'react';
import { calculatePrice, ProductSchema } from '@/lib/pricing/PriceCalculator';

type Props = {
  product: ProductSchema;
  defaultWidthIn?: number;
  defaultHeightIn?: number;
};

export default function Configurator({ product, defaultWidthIn = 24, defaultHeightIn = 18 }: Props) {
  const [widthIn, setWidthIn] = useState<number>(defaultWidthIn);
  const [heightIn, setHeightIn] = useState<number>(defaultHeightIn);
  const [quantity, setQuantity] = useState<number>(1);
  const [opts, setOpts] = useState<Record<string, any>>(() => {
    const o: Record<string, any> = {};
    product.options.forEach((opt) => {
      if (opt.type === 'bool') o[opt.key] = false;
      else if (opt.type === 'enum') o[opt.key] = (opt as any).choices[0]?.value ?? '';
      else if (opt.type === 'color') o[opt.key] = (opt as any).choices?.[0] ?? '';
    });
    return o;
  });

  const price = useMemo(() => calculatePrice(product, { widthIn, heightIn, quantity, options: opts }), [
    product, widthIn, heightIn, quantity, opts
  ]);

  function addToCart() {
    const cartKey = 'sss_cart';
    const line = {
      slug: product.slug,
      name: product.name,
      widthIn, heightIn, quantity, options: opts,
      pricing: price,
      jobName: prompt('Job Name (optional)') || ''
    };
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    cart.push(line);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    alert('Added to cart.');
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <div className="text-sm font-medium">Width (inches)</div>
            <input type="number" value={widthIn} onChange={e=>setWidthIn(Number(e.target.value))} className="mt-1 w-full border rounded p-2" min={1} />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Height (inches)</div>
            <input type="number" value={heightIn} onChange={e=>setHeightIn(Number(e.target.value))} className="mt-1 w-full border rounded p-2" min={1} />
          </label>
          <label className="block">
            <div className="text-sm font-medium">Quantity</div>
            <input type="number" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="mt-1 w-full border rounded p-2" min={1} />
          </label>
        </div>

        <div className="space-y-3">
          {product.options.map((opt) => (
            <div key={opt.key}>
              <div className="text-sm font-medium">{opt.label}</div>
              {opt.type === 'bool' && (
                <label className="inline-flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={!!opts[opt.key]}
                    onChange={(e)=>setOpts({...opts, [opt.key]: e.target.checked})}
                  />
                  <span>Yes</span>
                </label>
              )}
              {opt.type === 'enum' && (
                <select
                  className="mt-1 border rounded p-2 w-full"
                  value={opts[opt.key]}
                  onChange={(e)=>setOpts({...opts, [opt.key]: e.target.value})}
                >
                  {(opt as any).choices.map((c:any)=>(
                    <option key={c.value} value={c.value}>
                      {c.value} {c.add ? `(+$${c.add}/sqft)` : ''}
                    </option>
                  ))}
                </select>
              )}
              {opt.type === 'color' && (
                <select
                  className="mt-1 border rounded p-2 w-full"
                  value={opts[opt.key]}
                  onChange={(e)=>setOpts({...opts, [opt.key]: e.target.value})}
                >
                  {(opt as any).choices.map((c:string)=>(
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      <aside className="border rounded p-4 space-y-2 sticky top-4 h-fit">
        <div className="text-lg font-semibold">{product.name}</div>
        <div className="text-sm text-gray-600">{price.sqft} sqft @ ${product.base_price_per_sqft}/sqft</div>
        <div className="text-sm">Options: ${price.optionsTotal}</div>
        <div className="text-xl font-bold">Unit: ${price.unitPrice}</div>
        <div className="text-sm">Qty: {price.quantity}</div>
        <div className="text-xl font-bold">Total: ${price.lineTotal}</div>
        <button onClick={addToCart} className="mt-2 w-full bg-black text-white py-2 rounded">Add to Cart</button>
      </aside>
    </div>
  );
}
