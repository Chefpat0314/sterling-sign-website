import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../../components/Layout';

export default function Step11AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    cacByMetro: [],
    leadToDealCVR: [],
    installSLA: [],
    partnerNPS: 0,
    ordersFromMetroLPs: [],
    repeatShare: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading (in real implementation, this would fetch from analytics APIs)
    const loadAnalyticsData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalyticsData({
          cacByMetro: [
            { metro: 'Phoenix, AZ', cac: 45, leads: 120, deals: 18 },
            { metro: 'Dallas, TX', cac: 52, leads: 95, deals: 22 },
            { metro: 'Atlanta, GA', cac: 48, leads: 88, deals: 15 },
            { metro: 'Denver, CO', cac: 55, leads: 76, deals: 12 },
            { metro: 'Chicago, IL', cac: 58, leads: 82, deals: 16 }
          ],
          leadToDealCVR: [
            { persona: 'Contractor GC', leads: 245, deals: 49, cvr: 20.0 },
            { persona: 'Property Manager', leads: 189, deals: 38, cvr: 20.1 },
            { persona: 'Logistics', leads: 156, deals: 28, cvr: 17.9 }
          ],
          installSLA: [
            { metro: 'Phoenix, AZ', avgDays: 2.1, onTime: 96 },
            { metro: 'Dallas, TX', avgDays: 2.3, onTime: 94 },
            { metro: 'Atlanta, GA', avgDays: 2.5, onTime: 92 },
            { metro: 'Denver, CO', avgDays: 2.8, onTime: 89 },
            { metro: 'Chicago, IL', avgDays: 2.6, onTime: 91 }
          ],
          partnerNPS: 67,
          ordersFromMetroLPs: [
            { metro: 'Phoenix, AZ', orders: 45, revenue: 12500 },
            { metro: 'Dallas, TX', orders: 52, revenue: 14800 },
            { metro: 'Atlanta, GA', orders: 38, revenue: 9800 },
            { metro: 'Denver, CO', orders: 29, revenue: 7200 },
            { metro: 'Chicago, IL', orders: 41, revenue: 11200 }
          ],
          repeatShare: [
            { metro: 'Phoenix, AZ', repeatRate: 35, totalCustomers: 89 },
            { metro: 'Dallas, TX', repeatRate: 42, totalCustomers: 95 },
            { metro: 'Atlanta, GA', repeatRate: 38, totalCustomers: 76 },
            { metro: 'Denver, CO', repeatRate: 31, totalCustomers: 58 },
            { metro: 'Chicago, IL', repeatRate: 39, totalCustomers: 82 }
          ]
        });
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  if (loading) {
    return (
      <Layout title="Step 11 Analytics | Sterling Sign Solutions">
        <div className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Step 11 Analytics Dashboard | Sterling Sign Solutions">
      <Head>
        <title>Step 11 Analytics Dashboard | Sterling Sign Solutions</title>
        <meta name="description" content="Analytics dashboard for Step 11 national rollout metrics." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 11 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            National rollout performance metrics and KPIs
          </p>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Metros</h3>
            <p className="text-2xl font-bold text-gray-900">10</p>
            <p className="text-sm text-gray-600">Active markets</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Partner NPS</h3>
            <p className="text-2xl font-bold text-gray-900">{analyticsData.partnerNPS}</p>
            <p className="text-sm text-gray-600">Partner satisfaction</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg CAC</h3>
            <p className="text-2xl font-bold text-gray-900">$51</p>
            <p className="text-sm text-gray-600">Customer acquisition cost</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg CVR</h3>
            <p className="text-2xl font-bold text-gray-900">19.3%</p>
            <p className="text-sm text-gray-600">Lead to deal conversion</p>
          </div>
        </div>

        {/* CAC by Metro */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">CAC by Metro</h2>
            <p className="text-gray-600">Customer acquisition cost by market</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Metro</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">CAC</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Leads</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Deals</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">CVR</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.cacByMetro.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 text-gray-900">{item.metro}</td>
                      <td className="py-3 px-4 text-gray-900">${item.cac}</td>
                      <td className="py-3 px-4 text-gray-900">{item.leads}</td>
                      <td className="py-3 px-4 text-gray-900">{item.deals}</td>
                      <td className="py-3 px-4 text-gray-900">{((item.deals / item.leads) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lead to Deal CVR by Persona */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Lead to Deal CVR by Persona</h2>
            <p className="text-gray-600">Conversion rates by customer segment</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analyticsData.leadToDealCVR.map((item, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.persona}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{item.cvr}%</div>
                  <div className="text-sm text-gray-600">
                    {item.deals} deals from {item.leads} leads
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Install SLA Performance */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Install SLA Performance</h2>
            <p className="text-gray-600">Average installation days and on-time performance</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.installSLA.map((item, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.metro}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">{item.avgDays} days</div>
                  <div className="text-sm text-gray-600 mb-2">Average install time</div>
                  <div className="text-lg font-semibold text-blue-600">{item.onTime}%</div>
                  <div className="text-sm text-gray-600">On-time delivery</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders from Metro Landing Pages */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Orders from Metro Landing Pages</h2>
            <p className="text-gray-600">Revenue generated from metro-specific landing pages</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Metro</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Order</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.ordersFromMetroLPs.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 text-gray-900">{item.metro}</td>
                      <td className="py-3 px-4 text-gray-900">{item.orders}</td>
                      <td className="py-3 px-4 text-gray-900">${item.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-900">${Math.round(item.revenue / item.orders).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Repeat Customer Share */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Repeat Customer Share by Metro</h2>
            <p className="text-gray-600">Percentage of repeat customers by market</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.repeatShare.map((item, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.metro}</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{item.repeatRate}%</div>
                  <div className="text-sm text-gray-600">
                    {Math.round((item.repeatRate / 100) * item.totalCustomers)} repeat customers
                  </div>
                  <div className="text-sm text-gray-500">
                    of {item.totalCustomers} total customers
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
