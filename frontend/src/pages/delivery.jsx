import React, { useState } from 'react';

import { ButtonGroup, Button } from "@material-tailwind/react";
import DeliveryTable from '@/widgets/deliveryPages/deliveryTable';
import TimeDelivery from '@/widgets/deliveryPages/timeDelivery';
import DeliveryVehicle from '@/widgets/deliveryPages/deliveryVehicle';
import DeliveryZone from '@/widgets/deliveryPages/deliveryZone';
import DeliveryDriver from '@/widgets/deliveryPages/deliveryDriver';


const Delivery_ = () => <DeliveryTable/>;
const TimesCharges = () => <TimeDelivery/>;
const Vehicles = () => < DeliveryVehicle />;
const Zones = () => <DeliveryZone/>;
const Drivers = () => <DeliveryDriver/>;

export const Delivery = () => {
  const [activeComponent, setActiveComponent] = useState('Delivery_');

  // Function to handle button click
  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };
  const getButtonClass = (component) => {
    return activeComponent === component ? 'bg-green-900 text-white' : 'bg-green-100	 text-black';
  };

  return (
    <>
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Today's Delivery</h1>
      </div>
      <div class="mx-4 p-4">
        <ButtonGroup>
        <Button className={getButtonClass('Delivery_')} onClick={() => handleButtonClick('Delivery_')}>Delivery</Button>
        <Button className={getButtonClass('TimesCharges')} onClick={() => handleButtonClick('TimesCharges')}>Times & Charges</Button>
        <Button className={getButtonClass('Vehicles')} onClick={() => handleButtonClick('Vehicles')}>Vehicles</Button>
        <Button className={getButtonClass('Zones')} onClick={() => handleButtonClick('Zones')}>Zones</Button>
        <Button className={getButtonClass('Drivers')} onClick={() => handleButtonClick('Drivers')}>Drivers</Button>
        </ButtonGroup>
      </div>
      
    </div>
    <div className="">
    {activeComponent === 'Delivery_' && <Delivery_ />}
    {activeComponent === 'TimesCharges' && <TimesCharges />}
    {activeComponent === 'Vehicles' && <Vehicles />}
    {activeComponent === 'Zones' && <Zones />}
    {activeComponent === 'Drivers' && <Drivers />}
  </div>
  </>
  )
}

export default Delivery