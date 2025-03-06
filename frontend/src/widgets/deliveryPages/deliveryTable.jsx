import api from '@/config';
import React, { useState, useEffect } from 'react';

const DeliveryTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  
  useEffect(() => {
    // Fetch deliveries data from the API
    const fetchDeliveries = async () => {
      try {
        const response = await api('/getDelivery');
        // const data = await response.json();
        setDeliveries(response.data);
        // console.log(deliveries)
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };
    
    fetchDeliveries();
  }, []);
  
  return (
<div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Delivery List</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 shadow-lg -mt-6 mb-8 p-6">
              <th className="py-4 px-6 text-left">Customer</th>
              <th className="py-4 px-6 text-left">Plan</th>
              <th className="py-4 px-6 text-left">Time</th>
              <th className="py-4 px-6 text-left">Location</th>
              <th className="py-4 px-6 text-left">Apartment Floor</th>
              <th className="py-4 px-6 text-left">Driver</th>
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length > 0 ? (
              deliveries.map((delivery, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-gray-900/10 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-6 text-gray-700 font-medium">{delivery.customer}</td>
                  <td className="py-4 px-6 text-gray-600">{delivery.plan}</td>
                  <td className="py-4 px-6 text-gray-600">{delivery.time}</td>
                  <td className="py-4 px-6 text-gray-600">{delivery.location}</td>
                  <td className="py-4 px-6 text-gray-600">{delivery.apartmentFloor || '-'}</td>
                  <td className="py-4 px-6 text-gray-600">{delivery.driver}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(delivery.date).toLocaleDateString()}
                  </td>
                  <td className={`py-4 px-6 font-semibold ${
                    delivery.status === 'Pending'
                      ? 'text-yellow-900'
                      : delivery.status === 'In Progress'
                      ? 'text-blue-500'
                      : delivery.status === 'Completed'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {delivery.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">No deliveries available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryTable;
