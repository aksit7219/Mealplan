import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dialog,
  DialogBody,
  Switch,
  Typography
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import api from "@/config";
import { Link } from "react-router-dom";

export function Customer() {
  const [CustomerData, setCustomerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [form, setForm] = useState({
    isAdmin: 'false'
  });

  const handleOpen = (user) => {
    setSelectedUser(user);
    setForm({ isAdmin: user.isAdmin ? 'true' : 'false' });
    setOpen(!open);
  };

  const handleSubmit = async () => {
    const updatedUser = { ...selectedUser, isAdmin: form.isAdmin === 'true' };
    try {
      await api.put(`/putSingleUser/${selectedUser._id}`, updatedUser);
      // Update the customer data locally
      setCustomerData((prev) =>
        prev.map((user) => (user._id === selectedUser._id ? updatedUser : user))
      );
      setOpen(false); // Close the dialog after saving
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  useEffect(() => {
    const getCustomer = async () => {
      let result = await api.get('/getusers');
      setCustomerData(result.data.data);
    };
    getCustomer();
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Authors Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Mobile", "Admin", "DOB", "Action"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CustomerData.map(
                ({ _id, firstName, lastName, email, mobile, isAdmin, dob }, key) => {
                  const className = `py-3 px-5 ${key === CustomerData.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={_id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src="https://docs.material-tailwind.com/img/face-2.jpg"
                            alt={firstName}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {firstName}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {mobile}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={isAdmin ? "green" : "blue-gray"}
                          value={isAdmin ? "Admin" : "User"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(dob).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Link to={`/customers/${_id}`}>
                          <Typography
                            // onClick={() => handleOpen({ _id, firstName, lastName, email, mobile, isAdmin, dob })}
                            className="text-xs font-semibold text-blue-gray-600 cursor-pointer"
                          >
                            Edit
                          </Typography>
                        </Link>

                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Dialog size="sm" open={open} handler={() => setOpen(!open)} className="p-4">
        <DialogBody className="space-y-4 pb-6">
          <dl className="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
            {Object.entries(selectedUser).map(([key, value]) => (
              <div className="flex flex-col pb-3 capitalize" key={key}>
                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                  {key}
                </dt>
                {key === "isAdmin" ? (
                  <Switch
                    onChange={() => setForm({ isAdmin: form.isAdmin === "true" ? "false" : "true" })}
                    checked={form.isAdmin === "true"}
                  />
                ) : (
                  <dd className="text-lg font-semibold">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </dd>
                )}
              </div>
            ))}
          </dl>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogBody>
      </Dialog>
    </div>
  );
}

export default Customer;
