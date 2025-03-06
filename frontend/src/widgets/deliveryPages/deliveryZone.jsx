import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Input,
  Typography,
  IconButton,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import api from "@/config";
import DeliveryZoneCard from "../cards/DeliveryZoneCard";

const DeliveryZone = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    districts: "",
    description: "",
    imageLink: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editZoneId, setEditZoneId] = useState(null);
  const [zones, setZones] = useState([]);
  // const [isAddedSuccess, setIsAddedSuccess] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // Edit existing zone
        await api.put(`/editZone/${editZoneId}`, formData);
        alert("Zone updated successfully");

        // Update the zone in the local state
        setZones((prevZones) =>
          prevZones.map((zone) =>
            zone._id === editZoneId ? { ...zone, ...formData } : zone
          )
        );
      } else {

        // // Add new zone
        // await api.post('/addZone', formData);
        // alert("Zone added successfully");
        // setIsAddedSuccess(true); // Set flag to true after successful addition

        // Add new zone
        const response = await api.post('/addZone', formData);
        const newZone = response.data;
        alert("Zone added successfully");

        // Add the new zone to the local state
        setZones((prevZones) => [...prevZones, newZone]);
      }
      fetchZones();
      setFormData({ name: "", city: "", districts: "", description: "", imageLink: "" });
      setIsEditMode(false);
      handleOpen();
    } catch (error) {
      console.error("Error saving zone:", error);
      alert("Failed to save zone");
    }
  };

  const fetchZones = async () => {
    try {
      const response = await api.get('/getDeliveryZones');
      setZones(response.data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const handleEdit = (zone) => {
    setFormData(zone);
    setEditZoneId(zone._id);
    setIsEditMode(true);
    handleOpen();
  };

  const handleDelete = async (zoneId) => {
    try {
      await api.delete(`/deleteZone/${zoneId}`);
      alert("Zone deleted successfully");
      fetchZones();
    } catch (error) {
      console.error("Error deleting zone:", error);
      alert("Failed to delete zone");
    }
  };

  useEffect(() => {
    fetchZones();
    // setIsAddedSuccess(false); // Reset the flag after fetching zones
  }, []);

  return (
    <>
      <Button onClick={() => { setIsEditMode(false); setFormData({ name: "", city: "", districts: "", description: "", imageLink: "" }); handleOpen(); }} variant="gradient">
        Add New Zone
      </Button>
      <Dialog open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {isEditMode ? "Edit Zone" : "New Zone"}
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
        <DialogBody>
          <div className="flex flex-row space-x-6">
            <div className="basis-1/2 space-y-6">
              <Input
                size="md"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                size="md"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="basis-1/2 space-y-6">
              <Input
                size="md"
                label="Districts"
                name="districts"
                value={formData.districts}
                onChange={handleChange}
              />
              <Input
                size="md"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="my-6">
            <Input
              label="Image Link"
              name="imageLink"
              value={formData.imageLink}
              onChange={handleChange}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update Zone" : "Add Zone"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Display the zones in cards */}
      <div className="grid grid-cols-5 gap-4 mt-6">
        {zones.map((zone) => (
          <DeliveryZoneCard
            key={zone._id}
            zoneData={zone}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </>
  );
};

export default DeliveryZone;
