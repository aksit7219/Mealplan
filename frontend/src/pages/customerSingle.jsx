import { fetchCustomerData, updateCustomer } from "@/redux/reducers/customerSlice";
import Button from "@/widgets/layout/button";
import { Input, Option, Switch, Textarea, Typography } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
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


const CustomerSingle = () => {
    const dispatch = useDispatch()
    const { customers, status, error } = useSelector((state) => state.customers)
    const [SingleCustomer, setSingleCustomer] = useState({})
    const params = useParams()
    const [formData, setFormData] = useState({})
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate()


    // Fetch customers on component mount
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCustomerData());

        }
        const fetchCountries = async () => {
            try {
                // location.pathname === "/restaurants" ? setPageType("restaurants") : setPageType("user")
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
    }, [status, dispatch]);


    useEffect(() => {
        const loadSingleCustomer = async () => {
            if (params.CustomerId === "create") {
                setFormData(prevData => ({
                    mealPlan: prevData.mealPlan,
                    image: "https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp"

                }));
            } else if (customers.length > 0) {
                const foundCustomer = customers.find((customer) => customer._id === params.CustomerId);
                if (foundCustomer) {
                    setFormData(foundCustomer)
                } else {
                    console.log("ooppss-------------")
                    // If no matching customer is found, redirect to home
                    navigate('/');
                }
            }
        }
        loadSingleCustomer()

    }, [params.CustomerId, customers]);

    // Conditional rendering based on status
    if (status === 'loading') {
        return <div>Loading customers...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

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

    const handleAddressChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;
        setFormData({
            ...formData, address: { ...formData.address, [name]: value },
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

    const handleSubmit = async (e) => {
        console.log(formData)
        e.preventDefault();
        if (formData._id) {
            await dispatch(updateCustomer({ id: formData._id, user: formData }))
            await dispatch(fetchCustomerData());
        }
    }

    return (
        <>
            <form className="h-full" onSubmit={handleSubmit} >
                <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">{formData.firstName}'s Details</h2></div>
                <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="space-y-6">

                            <Input label="First Name" onChange={handleChange} size="lg" type='text' name="firstName" defaultValue={formData.firstName} required />
                            <Input label="Last Name" onChange={handleChange} size="md" type='text' name="lastName" defaultValue={formData.lastName} required />
                            <Input label="Email" onChange={handleChange} size="lg" type='email' name="email" defaultValue={formData.email} required />
                            <Input label="Phone Number" onChange={handleChange} size="lg" type='number' name="mobile" defaultValue={formData.mobile} required />
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
                            <div className="mb-1 flex flex-row gap-6">
                                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                    IsAdmin
                                </Typography>
                                <Switch name="isAdmin"
                                    checked={formData.isAdmin || false}
                                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })} />
                            </div>

                        </div>

                        <div className="space-y-6">
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
                                    Date of Birth
                                </Typography>
                                <Input
                                    size="lg"
                                    type="date"
                                    name="dob"
                                    value={formData.dob ? new Date(formData.dob).toISOString().substring(0, 10) : ''} // Correct date formatting
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
                                    Dislikes
                                </Typography>
                                <Select
                                    isMulti
                                    name="dislikes"
                                    options={defaultDislikes}
                                    value={defaultDislikes.filter(option => formData?.dislikes?.includes(option.value))}
                                    onChange={handleSelectChange}
                                /></div>
                            <div className="mb-1 flex flex-col gap-6">
                                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                    Allergies
                                </Typography>
                                <Select
                                    isMulti
                                    name="allergies"
                                    options={defaultAllergies}
                                    value={defaultAllergies.filter(option => formData?.allergies?.includes(option.value))}
                                    onChange={handleSelectChange}
                                /></div>
                            <div className="flex flex-row gap-4">

                                <Input
                                    size="lg"
                                    label="Weight (kg)"
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="Weight"
                                    required

                                />

                                <Input
                                    label=" Height (cm)"
                                    size="lg"
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="Height"
                                    // className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div >

                <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Address</h2></div>
                <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        <div className="space-y-6">
                            <Input onChange={handleAddressChange} label="District" size="lg" type='text' value={formData?.address?.district || ''} name="district" required />
                            <Input onChange={handleAddressChange} label="City" size="md" type='text' value={formData?.address?.city || ''} name="city" required />
                            {/* <Textarea onChange={handleAddressChange} label="Address" size="lg" name="address" required /> */}
                            <Input onChange={handleAddressChange} label="Area" size="lg" value={formData?.address?.area || ''} name="area" required />
                        </div>
                        <div className="space-y-6">
                            <div className="flex flex-row gap-4">
                                <Input onChange={handleAddressChange} label="Building" size="lg" value={formData?.address?.building || ''} name="building" required />
                                <Input onChange={handleAddressChange} label="Floor" size="lg" value={formData?.address?.floor || ''} name="floor" required />
                            </div>
                            <div className="flex flex-row gap-4">
                                <Input onChange={handleAddressChange} label="Apartment" size="lg" value={formData?.address?.apartment || ''} name="apartment" required />
                            </div>
                            <div className="flex flex-row gap-4">
                                <Input onChange={handleAddressChange} label="Delivery Note" size="lg" value={formData?.address?.deliveryNote || ''} name="deliveryNote" required />
                            </div>
                            <div className="flex flex-row gap-4">
                                <Input onChange={handleAddressChange} label="Timing From" size="lg" type='time' value={formData?.address?.deliveryTimings || ''} name="deliveryTimings" required />
                                {/* <Input onChange={handleAddressChange} label="Timing To" size="lg" type='time' name="timingTo" required /> */}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between space-x-4">
                        <div className="space-x-4">
                            <Button variant="text" className="text-red-500">
                                Delete
                            </Button>
                        </div>
                        <div className=" flex space-x-4">
                            <Button variant="text" >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </div>
                </div >
            </form>
        </>



    );
};


export default CustomerSingle;
