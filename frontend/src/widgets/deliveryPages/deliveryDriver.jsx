import React, { useState, useEffect } from "react";
import {
  Input,
  Option,
  Select,
  Button,
  Dialog,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import api from "@/config";
import DeliveryDriverCard from "../cards/DeliveryDriverCard";

const DeliveryDriver = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    shift: "",
    license: "",
    vehicle: "",
    zones: [],
    profile: "",
    licenseFront: "",
    licenseRear: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [zones, setZones] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataDeliveryDrivers, setDataDeliveryDrivers] = useState([]);
  const [editDriverId, setEditDriverId] = useState(null);

  const handleOpen = () => setOpen(!open);

  const handleEdit = (dd_Data) => {
    setFormData({
      name: dd_Data.name,
      phone: dd_Data.phone,
      email: dd_Data.email,
      password: dd_Data.password,
      shift: dd_Data.shift,
      license: dd_Data.license,
      vehicle: dd_Data.vehicle,
      zones: dd_Data.zones,
      profile: dd_Data.profile,
      licenseFront: dd_Data.licenseFront,
      licenseRear: dd_Data.licenseRear,
    });
    setEditDriverId(dd_Data._id);
    setIsEditMode(true);
    handleOpen();
  };

  const handleDelete = async (DriverId) => {
    try {
      await api.delete(`/deleteDriver/${DriverId}`);
      alert("Driver deleted successfully");
      fetchDriver();
    } catch (error) {
      console.error("Error deleting Driver:", error);
      alert("Failed to delete Driver");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {

    try {
      if (isEditMode) {
        await api.put(`/editDriver/${editDriverId}`, formData);
        console.log("Driver updated successfully");
        setDataDeliveryDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver._id === editDriverId ? { ...driver, ...formData } : driver
          )
        );

      } else {
        const response = await api.post("/addDriver", formData);
        console.log(response)
      console.log("Driver added successfully");
      
      setDataDeliveryDrivers((prevDrivers) => [...prevDrivers, response.data]);
        
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        shift: "",
        license: "",
        vehicle: "",
        zones: [],
        profile: "",
        licenseFront: "",
        licenseRear: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error submitting driver:", error);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const zonesResponse = await api("/getDeliveryZones");
        const vehiclesResponse = await api("/getDeliveryVehicles");
        const deliveryDriversResponse = await api("/getDeliveryDrivers");
        setZones(zonesResponse.data);
        setVehicles(vehiclesResponse.data);
        setDataDeliveryDrivers(deliveryDriversResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          setIsEditMode(false);
          setFormData({
            name: "",
            phone: "",
            email: "",
            password: "",
            shift: "",
            license: "",
            vehicle: "",
            zones: [],
            profile: "",
            licenseFront: "",
            licenseRear: "",
          });
          handleOpen();
        }}
        variant="gradient"
      >
        Add Driver
      </Button>

      <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {isEditMode ? "Edit Driver" : "Add Driver"}
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            {isEditMode
              ? "Update driver records"
              : "Keep driver records up-to-date and organized."}
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
          <div className="flex flex-row space-x-6">
            <div className="basis-1/2">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="basis-1/2">
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-row space-x-6">
            <div className="basis-1/2">
              <Input
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="basis-1/2">
              <Input
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-row space-x-6">
            <div className="basis-1/2">
              <Select
                label="Shift"
                value={formData.shift}
                onChange={(value) => setFormData({ ...formData, shift: value })}
              >
                <Option value="morning">Morning</Option>
                <Option value="afternoon">Afternoon</Option>
                <Option value="night">Night</Option>
              </Select>
            </div>
            <div className="basis-1/2">
              <Select
                label="Vehicle"
                value={formData.vehicle}
                onChange={(value) => setFormData({ ...formData, vehicle: value })}
              >
                {vehicles.map((vehicle) => (
                  <Option key={vehicle._id} value={vehicle._id}>
                    {vehicle.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-row space-x-6">
            <div className="basis-1/2">
              <Input
                label="Licence"
                name="license"
                value={formData.license}
                onChange={handleChange}
              />
            </div>
            <div className="basis-1/2">
              <Select
                label="Zones"

                value={formData.zones}
                onChange={(value) => setFormData({ ...formData, zones: value })}
              >
                {zones.map((zone) => (
                  <Option key={zone._id} value={zone._id}>
                    {zone.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

              <Input
                label="Profile Image URL"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
              />
              <Input
                label="License Front Image URL"
                name="licenseFront"
                value={formData.licenseFront}
                onChange={handleChange}
              />
              <Input
                label="License Rear Image URL"
                name="licenseRear"
                value={formData.licenseRear}
                onChange={handleChange}
              />
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dataDeliveryDrivers.map((dd_Data) => (
          <DeliveryDriverCard
            key={dd_Data._id}
            driverData={dd_Data}
            onEdit={() => handleEdit(dd_Data)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
};

export default DeliveryDriver;
