import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/config";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const genderOptions = [
  { value: '', label: 'Select Gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const defaultAllergies = [
  { label: "Peanuts", value: "Peanuts" },
  { label: "Shellfish", value: "Shellfish" },
  { label: "Milk", value: "Milk" },
  { label: "Eggs", value: "Eggs" },
];

const defaultDislikes = [
  { label: "Spicy Food", value: "Spicy Food" },
  { label: "Sweet Food", value: "Sweet Food" },
  { label: "Sour Food", value: "Sour Food" },
  { label: "Bitter Food", value: "Bitter Food" },
];

export function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    nationality: "",
    region: "",
    password: "",
    height: "",
    weight: "",
    dob: "",
    allergies: [],
    dislikes: [],
  });
  const location = useLocation();
  const [countries, setCountries] = useState([]);
  const [customAllergies, setCustomAllergies] = useState("");
  const [customDislikes, setCustomDislikes] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [pageType, setPageType] = useState('user')
  const [restaurants, setRestaurants] = useState({
    name: '',
    email: '',
    passwordHash: '',
    phone: '',
    address: '',
    description: '',
    profileImageUrl: '',

  })

  const restaurantsHandleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setRestaurants({
        ...restaurants,
        [name]: values,
      });
    } else {
      setRestaurants({
        ...restaurants,
        [name]: value,
      });
    }
  };

  const restaurantsHandleSubmit = async (e) => {
    e.preventDefault();
    console.log(restaurants)
    try {
      const response = await api.post("/restaurants",
        restaurants
      );
      console.log(response.data);
      alert("Success");
      navigate("/sign-in");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ ...errors, apiError: error.response.data.error });
      }
    }
  };
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        location.pathname === "/restaurants" ? setPageType("restaurants") : setPageType("user")
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(
          response.data.map((country) => ({
            label: country.name.common,
            value: country.name.common,
          }))
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality) newErrors.nationality = "Nationality is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.height) newErrors.height = "Height is required";
    if (!formData.weight) newErrors.weight = "Weight is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({
        ...formData,
        [name]: values,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      mobile: value,
    });
  };

  const handleSelectChange = (selectedOptions, actionMeta) => {
    setFormData({
      ...formData,
      [actionMeta.name]: Array.isArray(selectedOptions)
        ? selectedOptions.map((option) => option.value)
        : selectedOptions.value,
    });
  };

  const addCustomAllergy = () => {
    if (customAllergies) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, customAllergies],
      });
      setCustomAllergies("");
    }
  };

  const addCustomDislike = () => {
    if (customDislikes) {
      setFormData({
        ...formData,
        dislikes: [...formData.dislikes, customDislikes],
      });
      setCustomDislikes("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await api.post("/regUser",
        formData
      );
      console.log(response.data);
      alert("Success");
      navigate("/signin");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors({ ...errors, apiError: error.response.data.error });
      }
    }
  };

  return (
    pageType === "user" ?
      <section className="m-8 flex justify-center">
        <div className="w-full lg:w-5/5 flex flex-col items-center ">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your details to register.</Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/3" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                First Name
              </Typography>
              <Input
                size="lg"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Last Name
              </Typography>
              <Input
                size="lg"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Email
              </Typography>
              <Input
                size="lg"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Mobile Number
              </Typography>
              <PhoneInput
                country={'us'}
                value={formData.mobile}
                onChange={handlePhoneChange}
                inputStyle={{ width: '100%' }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Gender
              </Typography>
              <Select
                name="gender"
                options={genderOptions}
                value={genderOptions.find(option => option.value === formData.gender)}
                onChange={handleSelectChange}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Nationality
              </Typography>
              <Select
                name="nationality"
                options={countries}
                value={countries.find(option => option.value === formData.nationality)}
                onChange={handleSelectChange}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Region
              </Typography>
              <Input
                size="lg"
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Region"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Password
              </Typography>
              <Input
                size="lg"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Height (cm)
              </Typography>
              <Input
                size="lg"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Weight (kg)
              </Typography>
              <Input
                size="lg"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Date of Birth
              </Typography>
              <Input
                size="lg"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Allergies
              </Typography>
              <Select
                isMulti
                name="allergies"
                options={defaultAllergies}
                value={defaultAllergies.filter(option => formData.allergies.includes(option.value))}
                onChange={handleSelectChange}
              />
              {/* <Input
              size="lg"
              type="text"
              value={customAllergies}
              onChange={(e) => setCustomAllergies(e.target.value)}
              placeholder="Add custom allergy"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Button onClick={addCustomAllergy}>Add Allergy</Button> */}
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Dislikes
              </Typography>
              <Select
                isMulti
                name="dislikes"
                options={defaultDislikes}
                value={defaultDislikes.filter(option => formData.dislikes.includes(option.value))}
                onChange={handleSelectChange}
              />
              {/* <Input
              size="lg"
              type="text"
              value={customDislikes}
              onChange={(e) => setCustomDislikes(e.target.value)}
              placeholder="Add custom dislike"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Button onClick={addCustomDislike}>Add Dislike</Button> */}
            </div>
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree to the&nbsp;
                  <a
                    href="#"
                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button className="mt-6" fullWidth type="submit">
              Register Now
            </Button>
            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/sign-in" className="text-gray-900 ml-1">Sign in</Link>
            </Typography>
          </form>
        </div>
      </section> :
      <section className="m-8 flex justify-center">
        <div className="w-full lg:w-5/5 flex flex-col items-center ">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your details to register.</Typography>
          </div>
          <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/3" onSubmit={restaurantsHandleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Restaurant Name
              </Typography>
              <Input
                size="lg"
                type="text"
                name="name"
                onChange={restaurantsHandleChange}
                placeholder="Restaurant Name"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Phone
              </Typography>
              <Input
                size="lg"
                type="text"
                name="phone"
                onChange={restaurantsHandleChange}
                placeholder="Phone"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                email
              </Typography>
              <Input
                size="lg"
                type="text"
                name="email"
                onChange={restaurantsHandleChange}
                placeholder="Email"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Password
              </Typography>
              <Input
                size="lg"
                type="text"
                name="passwordHash"
                onChange={restaurantsHandleChange}
                placeholder="Password"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Address
              </Typography>
              <Input
                size="lg"
                type="text"
                name="address"
                onChange={restaurantsHandleChange}
                placeholder="Address"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Description
              </Typography>
              <Input
                size="lg"
                type="text"
                name="description"
                onChange={restaurantsHandleChange}
                placeholder="Description"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Profile Image URL
              </Typography>
              <Input
                size="lg"
                type="url"
                name="profileImageUrl"
                onChange={restaurantsHandleChange}
                placeholder="Profile Image URL"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                required
              />
            </div>
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree to the&nbsp;
                  <a
                    href="#"
                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button className="mt-6" fullWidth type="submit">
              Register Now
            </Button>
            <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              Already have an account?
              <Link to="/sign-in" className="text-gray-900 ml-1">Sign in</Link>
            </Typography>
          </form>

        </div>
      </section>
  );
}

export default Signup;
