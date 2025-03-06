import ImageCard from "@/widgets/cards/imageCard";
import { Card, Input, Switch, Textarea, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { redirect, useParams } from 'react-router-dom';
import { addMealPlan, fetchMealPlanData, updateMealPlan } from '../redux/reducers/mealPlanSlice';
import MealPalnForm from "@/widgets/forms/mealPalnForm";
import { Loader } from "@/widgets/layout";
import PopupForm from "@/widgets/layout/popUp";
import { CheckCircleIcon, PencilIcon, PencilSquareIcon, PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/widgets/layout/button";
import MealPlanBundle from "./mealPlanBundles";
const MealPlanSingle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { mealPlans, status, error } = useSelector((state) => state.mealPlan);
  const [SinglePlan, setSinglePlan] = useState({})
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [SelectedRange, setSelectedRange] = useState({})

  const togglePopup = (range) => {
    setSelectedRange(range)
    setIsOpen(!isOpen);
  };

  // Fetch meal plans if they are not already loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMealPlanData());
    }
  }, [status, dispatch]);

  // Find the single meal plan based on the ID
  useEffect(() => {
    const name = id.replace(/-/g, ' ');

    if (id === "create") {
      return setSinglePlan(null);
    } else if (mealPlans.length > 0) {
      const foundPlan = mealPlans.find((plan) => plan.name === name);
      if (foundPlan) {
        setSinglePlan(foundPlan);
      } else {
        navigate('/mealplans') // Set to null if no plan is found
      }
    }
  }, [id, mealPlans]);

  // Function to handle meal plan update
  const handleUpdate = (updatedPlan) => {
    // console.log(updatedPlan._id)
    if (updatedPlan._id) {
      dispatch(updateMealPlan({ id: SinglePlan._id, mealPlan: updatedPlan })).then(() => {
        dispatch(fetchMealPlanData());
        navigate(`/mealplans/${encodeURIComponent(updatedPlan.name.replace(/\s+/g, '-'))}`); // Redirect to the meal plans page after successful update
      });
    } else {
      dispatch(addMealPlan(updatedPlan))
      navigate(`/mealplans/${encodeURIComponent(updatedPlan.name.replace(/\s+/g, '-'))}`); // Redirect to the meal plans page after successful update

    }



  };


  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedRange({
      ...SelectedRange,
      [name]: type === 'checkbox' ? checked : value // For checkboxes, handle `checked` status
    });
  };


  // Handle form submission (for saving or updating)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (SelectedRange._id) {
      handleUpdate({ ...SinglePlan, planRanges: updatePlanRangesById(SelectedRange._id, SelectedRange) })
    } else {
      console.log({ ...SinglePlan, planRanges: [...SinglePlan.planRanges, SelectedRange] })
      handleUpdate({ ...SinglePlan, planRanges: [...SinglePlan.planRanges, SelectedRange] })

    }
  };

  const handleDelete = () => {

    if (SelectedRange._id) {
      console.log({ ...SinglePlan, planRanges: deletePlanRangesById(SelectedRange._id) })
      handleUpdate({ ...SinglePlan, planRanges: deletePlanRangesById(SelectedRange._id) })
    } else {
      console.log({ ...SinglePlan, planRanges: [...SinglePlan.planRanges, SelectedRange] })
      // handleUpdate({ ...SinglePlan, planRanges: [...SinglePlan.planRanges, SelectedRange] })

    }
  };

  // Function to update specific planrange an item by ID
  const updatePlanRangesById = (id, updatedData) => {
    return planRanges.map((plan) => {
      if (plan._id === id) {
        return { ...plan, ...updatedData };
      }
      // Return other items as they are
      return plan;
    });
  };

  // Function to delete specific planRange item by ID
  const deletePlanRangesById = (id) => {
    return planRanges.filter((plan) => plan._id !== id);

  };
  // for fetch planRanges heading dynamically form meaplan
  const headers = SinglePlan && SinglePlan.planRanges && SinglePlan.planRanges.length > 0
    ? Object.keys(SinglePlan.planRanges[0]).filter(header => header !== '_id')
    : [];

  // Ensure planRanges is defined and has at least one item
  const planRanges = SinglePlan && SinglePlan.planRanges ? SinglePlan.planRanges : [];
  if (status === 'loading') return <div><Loader /></div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!SinglePlan && !id === 'create') return <div>No Meal Plan Found</div>;


  return (
    <>

      <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Plan Details</h2></div>
      <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
        <MealPalnForm mealPlan={SinglePlan} onSubmit={handleUpdate} />
      </div>

      <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Plan Bundles</h2></div>
      {/* Conditionally render MealPlanBundle when SinglePlan._id is available */}
      {SinglePlan?._id ? <MealPlanBundle id={SinglePlan._id} n all={false} /> : <div>Loading Meal Plan Bundle...</div>}




      <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Plan Ranges</h2></div>
      {/* for ADD new plan Ranges */}
      <div className="flex items-end justify-end">
        <Button
          variant='text'
          className='border-blue-gray-500 border rounded-lg p-3'
          onClick={() => {
            // Create a blank object by reducing SinglePlan.planRanges[0] and setting all fields to empty strings
            const blankObject = SinglePlan.planRanges && SinglePlan.planRanges.length > 0
              ? Object.keys(SinglePlan.planRanges[0]).reduce((acc, key) => {
                acc[key] = ''; // Set each key to an empty string
                return acc;
              }, {})
              : {}; // Return an empty object if planRanges is undefined or empty

            // Delete the _id field from the blank object
            delete blankObject._id;

            // Set default value for 'forWeb' to false
            blankObject.forWeb = false;

            // Pass the blank object to the togglePopup function
            togglePopup(blankObject);
          }}
        >
          <PlusCircleIcon className="text-blue-gray-500" height={30} width={30} /> Add New
        </Button>

      </div>

      {/* end--------  for ADD new plan Ranges */}

      <div className="mt-7">
        {/* Tabular Data */}
        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </th>
                ))}
                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4" >Actions</th>
              </tr>
            </thead>
            <tbody>

              {planRanges.map((range, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50 hover:bg-green-100">

                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">{range.name}</Typography>
                  </td>

                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">{range.calories}</Typography>
                  </td>

                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">{range.description}</Typography>
                  </td>

                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">{range.forWeb ? <CheckCircleIcon color="green" height={20} width={20} /> : <XCircleIcon color="red" height={20} width={20} />}</Typography>
                  </td>

                  <td className="p-4" onClick={() => togglePopup(range)}>
                    <Typography variant="small" color="blue-gray" className="font-normal"><PencilSquareIcon height={20} width={20} /></Typography>
                  </td>


                </tr>

              ))}

            </tbody>

          </table>
        </Card>
        {isOpen ? (<PopupForm isOpen={isOpen} togglePopup={togglePopup} children={(
          <form className="h-full" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12 h-full">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-700">Plan Ranges Information</h3>
                <Input
                  label="Range Name"
                  size="lg"
                  name="name"
                  defaultValue={SelectedRange.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Calories"
                  size="lg"
                  name="calories"
                  defaultValue={SelectedRange.calories}
                  onChange={handleChange}
                  required
                />

                <Textarea
                  label="Description"
                  size="md"
                  name="description"
                  defaultValue={SelectedRange.description}
                  onChange={handleChange}
                  required
                />
                <div className="flex flex-row justify-between space-x-4 mb-4 border border-blue-gray-200 rounded-[7px] px-3 py-2.5 ">
                  <h3 className="text-s font-medium text-gray-700">For Website </h3>
                  <Switch
                    name="forWeb"
                    // onChange={handleMealTypeChange}
                    // onChange={(e) => (setFormData({ ...formData, mealType: { Breakfast: formmealType.Breakfast === true ? false : true } }))}
                    onChange={handleChange}
                    color="blue-gray-900 "
                    id="forWeb"
                    defaultValue={false}
                    checked={SelectedRange.forWeb}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between items-center space-x-4">
              {/* Conditional "Delete" button */}
              <div className={`space-x-4 ${SelectedRange._id ? '' : 'hidden'}`}>
                <Button variant="text" onClick={handleDelete} className="text-red-500">
                  Delete
                </Button>
              </div>

              {/* Cancel and Save buttons */}
              <div className="flex space-x-4">
                <Button variant="text" onClick={() => setIsOpen(!open)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save
                </Button>
              </div>
            </div>


          </form>)} />) : ''}

      </div>
    </>
  )
};


export default MealPlanSingle;
