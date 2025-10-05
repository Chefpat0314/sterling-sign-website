import Link from 'next/link';
import Image from 'next/image';

export default function WhySterling() {
  const testimonials = [
    {
      quote: "Sterling delivered our construction site banners in 24 hours. The quality exceeded expectations and they've been up for 6 months with zero fading.",
      author: "Mike Rodriguez",
      company: "Rodriguez Construction",
      image: "/images/testimonials/mike-rodriguez.jpg"
    },
    {
      quote: "Professional installation and excellent customer service. Our aluminum signs look brand new after 2 years of California weather.",
      author: "Sarah Chen",
      company: "Chen Medical Center",
      image: "/images/testimonials/sarah-chen.jpg"
    },
    {
      quote: "Fast turnaround, competitive pricing, and the signage helped us stand out at the trade show. Sterling is our go-to partner.",
      author: "David Thompson",
      company: "Thompson Logistics",
      image: "/images/testimonials/david-thompson.jpg"
    }
  ];

  const metrics = [
    {
      number: "24-48",
      label: "Hour Turnaround",
      description: "Fast production for urgent projects"
    },
    {
      number: "5+",
      label: "Year Warranty",
      description: "On all aluminum and vinyl products"
    },
    {
      number: "98%",
      label: "Customer Satisfaction",
      description: "Based on post-installation surveys"
    },
    {
      number: "500+",
      label: "Projects Completed",
      description: "Across California construction sites"
    }
  ];

  const specSheets = [
    {
      title: "Vinyl Banner Specifications",
      description: "Material specs, mounting options, and durability guidelines",
      download: "/downloads/vinyl-banner-specs.pdf"
    },
    {
      title: "Aluminum Sign Guide",
      description: "Substrate options, finish choices, and installation requirements",
      download: "/downloads/aluminum-sign-guide.pdf"
    },
    {
      title: "ADA Compliance Checklist",
      description: "Ensuring your signage meets accessibility standards",
      download: "/downloads/ada-compliance-checklist.pdf"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Sterling Sign Solutions?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Family-owned since 2010, we've built our reputation on quality, speed, and reliability. 
            Here's what sets us apart from the competition.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{metric.number}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{metric.label}</div>
              <div className="text-sm text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            What Our Customers Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Family Heritage & Sustainability */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Family-Owned Heritage
            </h3>
            <p className="text-gray-700 mb-6">
              Founded by the Sterling family in 2010, we bring three generations of signage expertise 
              to every project. Our commitment to quality and customer service isn't just business—it's family tradition.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                14+ years serving California businesses
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Local ownership with personal accountability
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Direct access to decision makers
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sustainability Commitment
            </h3>
            <p className="text-gray-700 mb-6">
              We're committed to responsible manufacturing and reducing our environmental impact 
              while delivering durable, long-lasting signage solutions.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Recyclable aluminum substrates
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Water-based, low-VOC inks
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Local sourcing to reduce shipping
              </li>
            </ul>
          </div>
        </div>

        {/* Spec Sheets */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Download Our Specification Sheets
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {specSheets.map((sheet, index) => (
              <div key={index} className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{sheet.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{sheet.description}</p>
                <a
                  href={sheet.download}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Download PDF
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
