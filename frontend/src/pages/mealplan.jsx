import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
  Textarea,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import api from '@/config';
import { formToJSON } from 'axios';
import { Recipe } from '.';
import PlanCard from '@/widgets/cards/planCard';

export function MealPlan() {
  const [MealplanAll, setMealplanAll] = useState([]);
  const [Dishes, setDishes] = useState([]);
  const [selectedMealplan, setSelectedMealplan] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [open, setopen] = useState(true);  // New state to control visibility
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: 'true',
    image: '',
    dishes: [],
    price: '',
    calorieRange: '',
    restaurantId: '66b4888bdfdd074e47502f7a'
  });

  const handleOpen = (mealplan) => {
    setopen(false);  // Hide cards when editing
    if (!mealplan) {
      setFormData({
        name: '',
        description: '',
        isActive: 'true',
        image: '',
        dishes: [],
        price: '',
        calorieRange: '',
        restaurantId: '66b4888bdfdd074e47502f7a',
      });
      setIsEditing(false);
    } else {
      setSelectedMealplan(mealplan);
      setFormData({
        name: mealplan.name,
        description: mealplan.description,
        isActive: mealplan.isActive,
        image: mealplan.image,
        dishes: mealplan.dishes,
        price: mealplan.price,
        calorieRange: mealplan.calorieRange,
        restaurantId: '66b4888bdfdd074e47502f7a',
      });
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      isActive: !prevFormData.isActive,
    }));
  };

  const handleDishChange = (selectedOptions) => {
    setFormData({
      ...formData,
      dishes: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMealplans = formData;
    updatedMealplans._id = selectedMealplan._id;

    if (isEditing) {
      await api.put("/mealplans/" + selectedMealplan._id, formData);
      alert("Plan Updated!!!");
    } else {
      await api.post("/mealplans", formData);
      alert("Plan created!!!");
    }

    setMealplanAll((prev) =>
      prev.map((plans) => (plans._id === selectedMealplan._id ? updatedMealplans : plans))
    );
    setIsEditing(false);
    setopen(true);  // Show cards after save
  };

  const handleCancel = () => {
    setopen(true);  // Show cards when canceling
  };

  const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (user.email === "tushar.netsavvies@gmail.com") {
      const response = await api.delete("/mealplans/" + selectedMealplan._id);
      alert(response.data.message);
      const updatedMealplanAll = MealplanAll.filter(plan => plan._id !== selectedMealplan._id);
      setMealplanAll(updatedMealplanAll);
      setopen(true);  // Show cards after delete
    } else {
      alert("You have not access to this!");
    }
  };

  useEffect(() => {
    const getMealplanAll = async () => {
      try {
        const response = await api.get("/mealplans");
        setMealplanAll(response.data);
      } catch {
        console.log("error");
      }
    };
    getMealplanAll();

    const getDishes = async () => {
      try {
        const response = await api.get("/getdishes");
        setDishes(response.data.data);
      } catch {
        console.log("error");
      }
    };
    getDishes();
  }, []);

  return (
    <div className="mt-2 mb-8 flex-row gap-12">
      {/* <Button color="green" onClick={() => handleOpen(null)}>
        Add Dish
      </Button> */}
            {open ? (
        <div className="flex flex-wrap gap-4 items-stretch">
          {MealplanAll.map((plan,index)=>(
            <PlanCard key={index} title={plan.name} shortbrief={plan.shortBrief} planranges={plan.planRanges} url={`/mealplans/${encodeURIComponent(plan.name.replace(/\s+/g, '-').toLowerCase())}`}/>))}
        </div>
      ) // Removed extra curly braces
       : (<div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <form onSubmit={handleSubmit} className="h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {/* Left Column: Plan Information */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Plan Information</h2>
                      <Input
                        label="Meal Name"
                        size="lg"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Textarea
                        label="Description"
                        size="lg"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Calorie Range"
                        size="lg"
                        name="calorieRange"
                        value={formData.calorieRange}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        label="Price"
                        size="lg"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />

                    </div>
                    {/* Right Column: Plan Status */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Plan Status</h2>
                      <Switch
                        checked={formData.isActive}
                        onChange={handleSwitchChange}
                        color="green"
                        id="isActive"
                      />
                      <label className="block text-gray-700 font-semibold mb-2" htmlFor="dishes">
                        Dishes
                      </label>
                      <CreatableSelect
                        label="Add Dish"
                        size="lg"
                        name="dishes"
                        value={formData.dishes.map(dishId => {
                          const dish = Dishes.find((data) => data._id === dishId);
                          return { value: dishId, label: dish.dishName };
                        })}
                        onChange={handleDishChange}
                        options={Dishes.map(dish => ({ value: dish._id, label: dish.dishName }))}
                        isMulti
                        required
                      />
                      <Input
                        label="Image URL"
                        size="lg"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                      />
                      <div className="flex justify-center">
                        <img
                          src={formData.image}
                          alt="Meal Plan Image"
                          className="h-auto w-[250px] object-cover rounded-md shadow-md"
                        />
                      </div>

                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between space-x-4">
                    <div className="flex space-x-4">
                      <Button variant="text" onClick={handleDelete} className="text-red-500">
                        Delete
                      </Button>
                    </div>
                    <div className='space-x-4'>
                      <Button variant="text" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" color="green">
                        Save
                      </Button>
                    </div>

                  </div>
                </form>
              </div>
            )}
    </div>
  );
}

export default MealPlan;
