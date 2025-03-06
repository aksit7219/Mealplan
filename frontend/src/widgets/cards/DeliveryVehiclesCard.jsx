import React from 'react';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, Typography, Tooltip, Button } from '@material-tailwind/react';

const DeliveryVehiclesCard = ({ vehicleData, onEdit, onDelete }) => {
  const { name, type, plateNumber, issueDate, expiryDate, images } = vehicleData;

  const vehicleImage = images && images.length > 0 ? images[0] : 'https://via.placeholder.com/150';

  return (
<div className="col-4 col-xl-3 col-xxl-3">
  <Card className="scale-95 mb-4 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 rounded-lg">
    <CardBody>
      <div className="flex justify-center mb-4">
        <img
          className="h-36 w-52 object-cover rounded-lg border-2 border-gray-700 shadow-md"
          src={vehicleImage}
          alt={`${name} Vehicle`}
        />
      </div>
      <Typography variant="h5" className="text-center font-semibold text-gray-100 mb-2">
        {name}
      </Typography>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <Tooltip content={type}>
            <Typography className="flex items-center justify-center text-white">
              {type}
            </Typography>
          </Tooltip>
        </div>
        <div className="text-center">
          <Tooltip content={plateNumber}>
            <Typography className="flex items-center justify-center text-white">
              {plateNumber}
            </Typography>
          </Tooltip>
        </div>
      </div>

      <div className="text-xs text-white">
        <Typography className="text-center">Issue: {new Date(issueDate).toLocaleDateString()}</Typography>
        <Typography className="text-center mt-1">Expiry: {new Date(expiryDate).toLocaleDateString()}</Typography>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <button onClick={() => onEdit(vehicleData)}><PencilSquareIcon className="w-6 h-6" /></button>
        <button onClick={() => onDelete(vehicleData)}><TrashIcon className="w-6 h-6" /> </button>
      </div>
    </CardBody>
  </Card>
</div>
  );
};

export default DeliveryVehiclesCard;
