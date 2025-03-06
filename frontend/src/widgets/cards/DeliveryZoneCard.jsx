import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

const DeliveryZoneCard = ({ zoneData, onEdit, onDelete }) => {
  const { name, city, districts, description, imageLink } = zoneData;

  return (
    <div className="col-4 col-xl-3 col-xxl-3">
  <Card className="scale-95 mb-4 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 rounded-lg">
    <CardBody>
      <div className="flex justify-center mb-4">
        <img
          className="h-36 w-52 object-cover rounded-lg border-2 border-gray-700 shadow-md"
          src={imageLink}
          alt={`${name} Vehicle`}
        />
      </div>
        
      <Typography variant="h5" className="text-center font-semibold text-white mb-2">
        {name}
      </Typography>

        <div className="text-xs text-white">
          <Typography className="text-center"><strong>City :</strong> {city}</Typography>
          <Typography className="text-center"><strong>Districts :</strong> {districts}</Typography>
          <Typography className="text-center mt-1">{description}</Typography>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          <button onClick={() => onEdit(zoneData)}><PencilSquareIcon className="w-6 h-6" /></button>
          <button onClick={() => onDelete(zoneData._id)}><TrashIcon className="w-6 h-6" /> </button>
        </div>
      </CardBody>
    </Card>
    </div>
  );
};

export default DeliveryZoneCard;
