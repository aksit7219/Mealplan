import { addPlanBundle, deletePlanBundle, fetchPlanBundleData, updatePlanBundle } from "@/redux/reducers/planBundleSlice";
import ImageCard from "@/widgets/cards/imageCard";
import Button from "@/widgets/layout/button";
import { Card, CardBody, Input, Select, Option, Typography } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BundleSingle = () => {
    const { mealPlans } = useSelector((state) => state.mealPlan);
    const dispatch = useDispatch();
    const { planBundles, status, error } = useSelector((state) => state.planBundle);
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const [newDiscount, setNewDiscount] = useState({ days: 0, percentage: 0 });
    const [SelectedSizeRange, setSelectedSizeRange] = useState(null);

    const [formData, setFormData] = useState(() => {
        const currentMealPlan = mealPlans.find((plan) => plan.name === params.id.replace(/-/g, ' '));
        return {
            mealPlan: currentMealPlan ? currentMealPlan._id : '',
            image: "https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp"
        };
    });
    const meals = formData.meals || {};
    // Fetch meal plans if they are not already loaded
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPlanBundleData());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (status === 'succeeded' && planBundles.length > 0) {
            // Get the bundle by ID from params if it's not the 'create' route
            if (params.SingleBundleId !== "create") {
                const foundBundle = planBundles.find((bundle) => bundle._id === params.SingleBundleId);
                if (foundBundle) {
                    setFormData(foundBundle);
                } else {
                    // Redirect if no matching bundle is found
                    navigate('/');
                }
            } else {
                // Initialize for creating a new bundle
                const currentMealPlan = mealPlans.find((plan) => plan.name === params.id.replace(/-/g, ' '));
                setFormData(prevData => ({
                    mealPlan: currentMealPlan ? currentMealPlan._id : '',
                    image: prevData.image
                }));
            }
        }
    }, [status, planBundles, params.SingleBundleId, mealPlans, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target; // Change name to name if that's what you're using

        // Convert value to a number
        const numericValue = Number(value);

        // Update the priceRanges using map
        const updatedPriceRanges = formData.priceRanges.map((range) =>
            range._id === name ? { ...range, price: numericValue } : range
        );

        // Update the formData with the modified priceRanges
        setFormData({
            ...formData,
            priceRanges: updatedPriceRanges
        });

        // Log the updated priceRanges
    };



    const handleDiscountsChange = (e, id) => {
        if (!id) {
            const { name, value } = e.target;
            const numericValue = Number(value);
            setNewDiscount({ ...newDiscount, [name]: numericValue })
        } else if (id) {
            console.log("inside else", id)
            setFormData({ ...formData, discounts: formData.discounts.filter((discount) => discount._id !== id) })

        }

    };


    const handleMealsCount = (mealtype, operation) => {
        // const { name } = e.target;
        setFormData({
            ...formData,
            meals: {
                ...formData.meals,
                [mealtype]: operation === 'increment'
                    ? formData.meals[mealtype] + 1  // Increment meal count
                    : formData.meals[mealtype] > 0
                        ? formData.meals[mealtype] - 1  // Decrement meal count (but not below 0)
                        : 0,
            }

        });

    };


    // for change in sizeRanges Price and size 
    const [selectedMealSizes, setSelectedMealSizes] = useState({});

    const handleSizeChange = (id, e) => {
        const { name = "", value = "" } = e?.target || {};
        // setSelectedMealSizes(formData.sizeRanges.filter(size => size.range === SelectedSizeRange)[0].meal.filter(mealType => mealType._id === id)[0])
        const updatedFormData = {
            ...formData,
            sizeRanges: formData.sizeRanges.map((size) => {
                // Only update the selected size range
                if (size.range === SelectedSizeRange) {
                    return {
                        ...size,
                        meal: size.meal.map((mealType) => {
                            // Only update the specific mealType based on id
                            if (mealType._id === id) {
                                return {
                                    ...mealType,
                                    size: e,
                                    calorie: e === "small" ? "400" : e === "medium" ? "500" : e === "large" ? "600" : "0", // Set the new size value
                                    price: name === "price" ? value : 0
                                };
                            }
                            return mealType; // Keep other mealTypes unchanged
                        }),
                    };
                }
                return size; // Keep other sizeRanges unchanged
            }),
        };

        setFormData(updatedFormData); // Update formData with the new state
        // console.log(updatedFormData)

    };

    // Handle form submission (for saving or updating)
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        if (params.SingleBundleId !== 'create') {
            await dispatch(updatePlanBundle({ id: formData._id, planBundle: formData }))
            dispatch(fetchPlanBundleData())
            const foundBundle = planBundles.find((bundle) => bundle._id === params.SingleBundleId);
            setFormData(foundBundle)
        } else {
            // Add a new bundle and handle redirection
            const resultAction = await dispatch(addPlanBundle(formData));

            if (addPlanBundle.fulfilled.match(resultAction)) {
                const newBundle = resultAction.payload;
                if (newBundle && newBundle._id) {
                    dispatch(fetchPlanBundleData());
                    navigate(`/mealplans/${params.id}/${newBundle._id}`); // Redirect using the new bundle ID
                }
            } else {
                console.error('Failed to add bundle:', resultAction.error);
                // Optionally, handle error state
            }
        }

    };


    const handleDelete = (e) => {
        e.preventDefault(); // Prevent page refresh
        dispatch(deletePlanBundle(params.SingleBundleId))
        console.log(`/mealplans/${params.id}`)
        navigate(`/mealplans/${params.id}`)
    }


    return (
        <>
            <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Edit Bundle - {formData.name}</h2></div>
            <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <form className="h-full" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {/* Left Column: Plan Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-700">Plan Bundle Information</h3>

                            <Input
                                label="Meal Name"
                                size="lg"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Meal remarks"
                                size="lg"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Meal image"
                                size="lg"
                                name="image"
                                value={formData.image}
                                defaultValue={"https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp"}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex justify-start">
                                <ImageCard ImageUrl={formData.image} />
                            </div>
                        </div>
                        {/* Right Column: Plan Information */}

                        <div className={`space-y-6 ${params.SingleBundleId !== 'create' ? '' : 'hidden'}`}>
                            <h3 className="text-xl font-medium text-gray-700">Plan Bundle Information</h3>
                            <div className="grid grid-cols-2 p-4 gap-16">
                                {Object.keys(meals).length > 0 ? (
                                    Object.keys(meals).map((mealKey) => (
                                        <div className="flex items-center justify-between py-3 border-b border-gray-300">
                                            <div className="flex items-center space-x-3">
                                                ☕
                                                <span className="text-sm font-medium capitalize">{mealKey}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleMealsCount(mealKey, 'decrement')}
                                                    className="w-8 h-8 p-0 rounded-lg border-2 border-gray-200"
                                                    variant="outline"
                                                >-</button>
                                                <span className="w-8 text-center">{formData.meals[mealKey]}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMealsCount(mealKey, 'increment')}
                                                    className="w-8 h-8 p-0 rounded-lg border-2 border-gray-200"
                                                    variant="outline"
                                                >+</button>
                                            </div>
                                        </div>
                                    ))) : ''}



                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between items-center space-x-4">
                        {/* Conditional "Delete" button */}
                        <div onClick={handleDelete} className={`space-x-4`}>
                            <Button onClick={handleDelete} variant="text" className="text-red-500">
                                Delete
                            </Button>
                        </div>

                        {/* Cancel and Save buttons */}
                        <div className="flex space-x-4">
                            <Button variant="text">
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </div>

                </form >
            </div>


            <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Manage Bundle - {formData.name}</h2></div>
            <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <form className="h-full" onSubmit={handleSubmit}>
                    <Select label="Select Meal Type" onChange={(event) => setSelectedSizeRange(event)}>
                        {formData.sizeRanges && formData.sizeRanges.length > 0 ? (
                            formData.sizeRanges.map((val, index) => (
                                <Option key={index} className="capitalize" value={val.range}>
                                    {val.range}
                                </Option>
                            ))
                        ) : (
                            <Option disabled>No meal types available</Option>
                        )}
                    </Select>
                    {formData.sizeRanges &&
                        formData.sizeRanges.length > 0 &&
                        formData.sizeRanges
                            .filter((size) => size.range == SelectedSizeRange)
                            .map((size, index) => (

                                <div key={index} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 h-full">
                                    {size.meal && size.meal.length > 0 ? (
                                        size.meal.map((mealType, mealIndex) => (
                                            <Card key={mealIndex} className="mt-6 w-full sm:w-80 border">
                                                <CardBody>
                                                    <Typography variant="h5" color="blue-gray" className="mb-2 text-center">
                                                        {mealType.name}
                                                    </Typography>
                                                    <div className="mb-2">
                                                        <Select
                                                            label="Select Meal Type"
                                                            name="size"
                                                            // defaultChecked={mealType.size}
                                                            // defaultValue={mealType.size}
                                                            value={mealType.size}
                                                            onChange={(e) => handleSizeChange(mealType._id, e)}
                                                        >
                                                            <Option value="small">small</Option>
                                                            <Option value="medium">medium</Option>
                                                            <Option value="large">large</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="mb-2">
                                                        <Input label="Calorie" name="calorie" value={mealType.calorie} />
                                                    </div>
                                                    <div className="mb-2">
                                                        <Input type="number" label="Price" onChange={(e) => handleSizeChange(mealType._id, e)} name="price" />
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))
                                    ) : (
                                        "No meals available"
                                    )}
                                </div>

                            ))}

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between items-center space-x-4">
                        {/* Conditional "Delete" button */}
                        <div></div>

                        {/* Cancel and Save buttons */}
                        <div className="flex space-x-4">
                            <Button variant="text">
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </div>

                </form >
            </div >
        </>
    )
};


export default BundleSingle;
