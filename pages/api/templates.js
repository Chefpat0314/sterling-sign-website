export default function handler(req, res) {
  res.status(200).json({
    templates: [
      {
        product: 'banners_13oz',
        files: [
          { name: 'Banner 24x18', pdf: '/templates/pdf/banner_24x18.pdf', psd: '/templates/psd/banner_24x18.psd' }
        ]
      },
      {
        product: 'aluminum_040',
        files: [
          { name: 'Aluminum 12x12', pdf: '/templates/pdf/aluminum_12x12.pdf', psd: '/templates/psd/aluminum_12x12.psd' }
        ]
      }
    ]
  });
}
