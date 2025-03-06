import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import api from "@/config";
import DeliveryVehiclesCard from "../cards/DeliveryVehiclesCard";

const DeliveryVehicle = () => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dVehicleData, setDvehicleData] = useState([]);
  const [vehicleData, setVehicleData] = useState({
    name: '',
    type: '',
    plateNumber: '',
    issueDate: '',
    expiryDate: '',
    images: [''],
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchDeliveriesVehicle = async () => {
      try {
        const response = await api('/getDeliveryVehicles');
        setDvehicleData(response.data);
      } catch (error) {
        console.error('Error fetching delivery vehicles:', error);
      }
    };

    fetchDeliveriesVehicle();
  }, []);

  const handleOpen = () => setOpen(!open);
  const handleDeleteOpen = () => setDeleteOpen(!deleteOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...vehicleData.images];
    newImages[index] = value;
    setVehicleData((prevData) => ({
      ...prevData,
      images: newImages,
    }));
  };

  const handleEdit = (vehicle) => {
    setVehicleData(vehicle);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update vehicle logic
        const response = await api.put(`/editVehicle/${vehicleData._id}`, vehicleData);
        console.log("Vehicle updated successfully:", response.data);

        // Update the state with the edited vehicle
        setDvehicleData((prevData) => prevData.map((vehicle) =>
          vehicle._id === vehicleData._id ? response.data : vehicle
        ));

      } else {
        // Add new vehicle logic
        const response = await api.post('/addVehicle', vehicleData);
        console.log("Vehicle added successfully:", response.data);

        // Append the new vehicle to the list without reloading the page
        setDvehicleData((prevData) => [...prevData, response.data]);

      }

      setOpen(false);
      setVehicleData({
        name: "",
        type: "",
        plateNumber: "",
        issueDate: "",
        expiryDate: "",
        images: [],
      });
      setIsEditMode(false);
      setErrors(null);
    } catch (error) {
      setErrors(error.response?.data?.error || "An error occurred.");
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/deleteVehicle/${selectedVehicleId}`);
      console.log("Vehicle deleted successfully:", response.data);

      // Remove deleted vehicle from the state
      setDvehicleData((prevData) => prevData.filter((vehicle) => vehicle._id !== selectedVehicleId));

      setDeleteOpen(false);
      setSelectedVehicleId(null);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return (
    <>
      <Button onClick={() => {
        setIsEditMode(false);
        setVehicleData({ name: "", type: "", plateNumber: "", issueDate: "", expryDate: "", images: [''] });
        handleOpen();
      }} variant="gradient">
        Add New Vehicle
      </Button>

      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="p-4">
        <DialogHeader
          lassName="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          {/* Form fields similar to Add New */}
          <Input
            label="Name"
            name="name"
            value={vehicleData.name}
            onChange={handleChange} />
          <Input
            label="Type"
            name="type"
            value={vehicleData.type}
            onChange={handleChange} />
          <Input
            label="Plate Number"
            name="plateNumber"
            value={vehicleData.plateNumber}
            onChange={handleChange} />
          <Input
            label="Issue Date"
            type="date"
            name="issueDate"
            value={vehicleData.issueDate}
            onChange={handleChange} />
          <Input
            label="Expiry Date"
            type="date"
            name="expiryDate"
            value={vehicleData.expiryDate}
            onChange={handleChange} />

          {/* Image input management */}
          {vehicleData.images.map((image, index) => (
            <div key={index}>
              <Input
                label="Image Link"
                name="imageLink"
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)} />
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog size="sm" open={deleteOpen} handler={handleDeleteOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h5" color="gray">
            Confirm Deletion
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography>Are you sure you want to delete this vehicle?</Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleDeleteOpen}>Cancel</Button>
          <Button color="gray" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dVehicleData.length > 0 ? (
          dVehicleData.map((vehicle) => (
            <DeliveryVehiclesCard
              key={vehicle._id}
              vehicleData={vehicle}
              onEdit={handleEdit}
              onDelete={() => {
                setSelectedVehicleId(vehicle._id);
                handleDeleteOpen();
              }}
            />
          ))
        ) : (
          <p>No delivery vehicles available.</p>
        )}
      </div>
    </>
  );
};

export default DeliveryVehicle;
