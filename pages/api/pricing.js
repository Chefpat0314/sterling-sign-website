import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'pricing', 'pricing_normalized.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    res.status(200).json(json);
  } catch (e) {
    res.status(200).json({ 
      products: {
        banners_13oz: {
          slug: 'banners_13oz',
          name: '13oz Vinyl Banner',
          base_price_per_sqft: 5,
          quantity_tiers: [1,5,10,25],
          options: [
            { key: 'hems', type: 'bool', label: 'Hems', add: 0.5 },
            { key: 'grommets', type: 'enum', label: 'Grommets', choices: [
              { value: 'none', add: 0 },
              { value: 'every_2ft', add: 0.5 },
              { value: 'perimeter', add: 0.8 }
            ]},
            { key: 'pole_pockets', type: 'enum', label: 'Pole Pockets', choices: [
              { value: 'none', add: 0 },
              { value: 'top', add: 1.0 },
              { value: 'bottom', add: 1.0 },
              { value: 'both', add: 1.8 }
            ]}
          ]
        },
        aluminum_040: {
          slug: 'aluminum_040',
          name: '.040 Aluminum Sign',
          base_price_per_sqft: 14,
          quantity_tiers: [1,5,10,25],
          options: [
            { key: 'corners', type: 'enum', label: 'Corners', choices: [
              { value: 'square', add: 0 },
              { value: 'rounded', add: 0.5 }
            ]},
            { key: 'holes', type: 'enum', label: 'Holes', choices: [
              { value: 'none', add: 0 },
              { value: 'four_corners', add: 0.8 },
              { value: 'top', add: 0.4 },
              { value: 'bottom', add: 0.4 }
            ]},
            { key: 'laminate', type: 'enum', label: 'Laminate', choices: [
              { value: 'none', add: 0 },
              { value: 'gloss', add: 1.0 },
              { value: 'matte', add: 1.0 }
            ]}
          ]
        },
        door_hours_cut_vinyl: {
          slug: 'door_hours_cut_vinyl',
          name: 'Door Hours (Cut Vinyl)',
          base_price_per_sqft: 18,
          quantity_tiers: [1,3,5],
          options: [
            { key: 'color', type: 'color', label: 'Vinyl Color', choices: ['white','black','gold','silver'], add: 0 },
            { key: 'install', type: 'enum', label: 'Install Choice', choices: [
              { value: 'pickup', add: 0 },
              { value: 'local_install', add: 6 },
              { value: 'ship', add: 3 }
            ]}
          ]
        }
      }
    });
  }
}
