import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

const DeliveryDriverCard = ({ driverData, onEdit, onDelete }) => {
  const {name,phone,email,password,shift,license,vehicle,zones,profile,licenseFront,licenseRear} = driverData;

  return (
<div className="col-4 col-xl-3 col-xxl-3">
  <Card className="scale-95 mb-4 shadow-lg bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 rounded-lg">
    <CardBody>
      <div className="flex justify-center mb-4">
          <img
            className="h-36 w-52 object-cover rounded-lg border-2 border-gray-700 shadow-md"
            src={profile}
            alt={`${name} Vehicle`}
          />
        </div>

        <Typography variant="h5" className="text-center font-semibold text-white mb-2">
        {name}
      </Typography>

      <div className="text-xs text-white">
        <Typography className="text-center"><strong>Phone :</strong> {phone}</Typography>
        <Typography className="text-center"><strong>Email:</strong> {email}</Typography>
        <Typography className="text-center mt-1"><strong>Sift:</strong> {shift}</Typography>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <button onClick={() => onEdit(driverData)}><PencilSquareIcon className="w-6 h-6" /></button>
        <button onClick={() => onDelete(driverData._id)}><TrashIcon className="w-6 h-6" /> </button>
      </div>
      </CardBody>

    </Card>
    </div>
  );
};

export default DeliveryDriverCard;
