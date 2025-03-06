import React, { useEffect, useState } from "react";
import api from "@/config";
import {
  ButtonGroup,
  Button,
  Dialog,
  Input,
  Typography,
  DialogBody,
  IconButton,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const TimeDelivery = () => {
  const [Timedata, setTimedata] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  useEffect(() => {
    const fetchDeliverysetTimedata = async () => {
      try {
        const response = await api("/getDeliveryTiming");
        const data = response.data.data || [];
        if (Array.isArray(data)) {
          setTimedata(data);
          if (data.length > 0) {
            setSelectedCity(data[0]);
          }
        } else {
          console.error("Expected array but got:", typeof data);
          setTimedata([]);
        }
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliverysetTimedata();
  }, []);

  const [formData, setFormData] = useState({
    city: "",
    title: "",
    from: "",
    until: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTiming = {
      title: formData.title,
      from: formData.from,
      until: formData.until,
    };
    setSelectedCity({});

    try {
      if (isEditing && currentEditIndex !== null) {
        const updatedCity = { ...selectedCity };
        updatedCity.timings[currentEditIndex] = newTiming;

        const response = await api.put(
          `/updateDeliveryTiming/${selectedCity.city}`,
          {
            timings: updatedCity.timings,
          }
        );
        console.log("Delivery timing updated:", response.data);

        setSelectedCity(updatedCity);
      } else {
        const response = await api.post("/addDeliveryTiming", {
          city: formData.city,
          timings: [newTiming],
        });
        Timedata.push({ city: formData.city, timings: [newTiming] });
        console.log("Delivery timing added:", response.data);

        const updatedCity = {
          ...selectedCity,
          timings: [...selectedCity.timings, newTiming],
        };
        setSelectedCity(updatedCity);
      }

      setOpen(false);
      setFormData({
        city: "",
        title: "",
        from: "",
        until: "",
      });
      setIsEditing(false);
      setCurrentEditIndex(null);
    } catch (error) {
      console.error(
        "Error adding/updating delivery timing:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const [selectedCity, setSelectedCity] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
    setIsEditing(false);
    setFormData({
      city: selectedCity.city,
      title: "",
      from: "",
      until: "",
    });
  };

  const handleEdit = (timing, index) => {
    setFormData({
      city: selectedCity.city,
      title: timing.title,
      from: timing.from,
      until: timing.until,
    });
    setIsEditing(true);
    setCurrentEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (timing, index) => {
    try {
      const response = await api.delete("/deleteTiming", {
        data: {
          city: selectedCity.city,
          title: timing.title,
        },
      });
      console.log("Timing deleted:", response.data);

      // Remove the deleted timing from the UI
      const updatedCity = { ...selectedCity };
      updatedCity.timings = updatedCity.timings.filter((_, i) => i !== index);
      setSelectedCity(updatedCity);

      // Optionally update the Timedata if needed
      const updatedTimedata = Timedata.map((city) =>
        city.city === selectedCity.city
          ? { ...city, timings: updatedCity.timings }
          : city
      );
      setTimedata(updatedTimedata);
    } catch (error) {
      console.error(
        "Error deleting timing:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <>
      <ButtonGroup className="mx-10">
        {Array.isArray(Timedata) && Timedata.length > 0 ? (
          Timedata.map((item, index) => (
            <Button
              className={`${
                selectedCity && selectedCity.city === item.city
                  ? "bg-gray-700"
                  : "bg-gray-900"
              } text-white`}
              key={index}
              onClick={() => setSelectedCity(item)}
            >
              {item.city}
            </Button>
          ))
        ) : (
          <p>No delivery data available</p>
        )}
      </ButtonGroup>
      <br />
      <div className="flex flex-row mx-10">
        <div className="basis-1/2">
          <Button
            className="bg-gray-900 text-white"
            onClick={handleOpen}
          >
            New Timing
          </Button>
          <Dialog open={open} handler={handleOpen} className="p-4">
            <DialogHeader className="relative m-0 block">
              <Typography variant="h4" color="blue-gray">
                {isEditing ? "Edit Timing" : "New Timing"}
              </Typography>
              <Typography className="mt-1 font-normal text-gray-600">
                Add City, Title, and Timing
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
            <form onSubmit={handleSubmit}>
              <DialogBody>
                <div className="flex flex-row">
                  <div className="basis-1/2 mx-2">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      disabled={isEditing}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="basis-1/2 mx-3">
                    <Input
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-row my-3">
                  <div className="basis-1/2 mx-3">
                    <Input
                      type="time"
                      label="From"
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      className="bg-white rounded-md"
                      containerProps={{ className: "mt-4" }}
                      required
                    />
                  </div>
                  <div className="basis-1/2 mx-3">
                    <Input
                      type="time"
                      label="Until"
                      name="until"
                      value={formData.until}
                      onChange={handleChange}
                      className="bg-white rounded-md"
                      containerProps={{ className: "mt-4" }}
                      required
                    />
                  </div>
                </div>
              </DialogBody>
              <DialogFooter className="flex flex-wrap justify-between gap-4">
                <Button type="submit" className="ml-auto">
                  {isEditing ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
        </div>
        <div className="basis-1/2">
          {/* <Button className="mx-3 bg-light-green-100 text-black">
            Days off
          </Button> */}
        </div>
      </div>
      <div className="mt-10">
        {selectedCity ? (
          <div>
            <h2 className="text-xl font-bold">{selectedCity.city}</h2>
            {selectedCity.timings && selectedCity.timings.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Until
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedCity.timings.map((timing, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {timing.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {timing.from}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {timing.until}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(timing, index)}>
                          <PencilSquareIcon className="w-6 h-6 mx-2" />
                        </button>
                        <button onClick={() => handleDelete(timing, index)}>
                          <TrashIcon className="w-6 h-6 mx-2" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No timings available for this city.</p>
            )}
          </div>
        ) : (
          <p>Select a city to see its timings</p>
        )}
      </div>
    </>
  );
};

export default TimeDelivery;
