import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  CardFooter,
  Tooltip,
  Button,
  Switch,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea
} from '@material-tailwind/react';
import CreatableSelect from 'react-select/creatable';
import React, { useEffect, useState } from 'react';
import api from '@/config';
import MenuCard from '@/widgets/cards/menu-card';

export function AddMenu() {
  const [dishes, setDishes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    dishName: '',
    description: '',
    price: '',
    category: [],
    ingredients: [],
    cuisine: '',
    enabledisable: 'enable',
    dietaryRestrictions: '',
    calories: '',
    fatContent: '',
    proteinContent: '',
    carbohydrateContent: '',
    fiberContent: '',
    image: '',
    restaurant: "66b4888bdfdd074e47502f7a"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentDishId, setCurrentDishId] = useState(null);

  const ingredientOptions = [
    { value: 'tomato', label: 'Tomato' },
    { value: 'cheese', label: 'Cheese' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'basil', label: 'Basil' },
    { value: 'olive_oil', label: 'Olive Oil' },
  ];

  const categoryOptions = [
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'breakfast', label: 'Breakfast' },
  ];

  const handleOpen = (dish = null) => {
    if (dish) {
      setForm({
        dishName: dish.dishName,
        description: dish.description,
        price: dish.price,
        enabledisable: dish.enabledisable,
        category: dish.category,
        ingredients: dish.ingredients,
        cuisine: dish.cuisine,
        dietaryRestrictions: dish.dietaryRestrictions,
        calories: dish.calories,
        fatContent: dish.fatContent,
        proteinContent: dish.proteinContent,
        carbohydrateContent: dish.carbohydrateContent,
        fiberContent: dish.fiberContent,
        image: dish.image,
        restaurant: "66b4888bdfdd074e47502f7a"
      });
      setCurrentDishId(dish._id); // Assuming the dish has an _id field
      setIsEditing(true);
    } else {
      setForm({
        dishName: '',
        description: '',
        price: '',
        category: [],
        ingredients: [],
        cuisine: '',
        enabledisable: 'enable',
        dietaryRestrictions: '',
        calories: '',
        fatContent: '',
        proteinContent: '',
        carbohydrateContent: '',
        fiberContent: '',
        image: '',
        restaurant: "66b4888bdfdd074e47502f7a"
      });
      setCurrentDishId(null);
      setIsEditing(false);
    }
    setOpen(!open);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm((prevForm) => ({ ...prevForm, image: e.target.files[0] }));
  };

  const handleIngredientsChange = (selectedOptions) => {
    setForm({
      ...form,
      ingredients: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleCategoryChange = (selectedOptions) => {
    setForm({
      ...form,
      category: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleSubmit = async (e) => {
    handleOpen()
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing dish
        await api.put("/adddish/" + currentDishId, form);
      } else {
        // Add new dish
        await api.post("/adddish", form);
      }
      // Refresh dishes list
      const response = await api.get("/getdishes");
      setDishes(response.data.data);
      handleOpen();
    } catch (error) {
      console.error("Error submitting form", error);
    }

    setForm({
      dishName: '',
      description: '',
      price: '',
      category: [],
      ingredients: [],
      cuisine: '',
      enabledisable: 'enable',
      dietaryRestrictions: '',
      calories: '',
      fatContent: '',
      proteinContent: '',
      carbohydrateContent: '',
      fiberContent: '',
      image: '',
      restaurant: "66b4888bdfdd074e47502f7a"
    });
  };

  const handelDelete = async () => {
    const user = JSON.parse(localStorage.getItem("authUser"))
    if (user.email === "tushar.netsavvies@gmail.com") {
      const response = await api.delete("/adddish/" + currentDishId)
      alert(response.data.message)
      // Refresh dishes list
      const response1 = await api.get("/getdishes");
      setDishes(response1.data.data);
      setOpen(!open)
    } else {
      alert("You have not access of this !")
    }

  }




  useEffect(() => {
    const getdish = async () => {
      try {
        const response = await api.get("/getdishes");
        setDishes(response.data.data);
      } catch {
        console.log("error");
      }
    };
    getdish();
  }, []);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <div className="flex justify-center mb-4">
          <Button color="green" onClick={() => handleOpen()}>
            Add Dish
          </Button>
        </div>

        <Card>
          <div className="w-full h-full">
            <div className="mt-12 mb-8 flex flex-col gap-12">
              <div className="w-full h-full flex flex-wrap justify-center gap-8">
                {dishes.map((data, i) => (
                  <MenuCard
                    key={i}
                    title={data.dishName}
                    imgSrc={data.image}
                    onEdit={() => handleOpen(data)}
                    isEnabled={data.enabledisable}
                    description={data.description}
                    categories={data.category}
                  />
                ))}

                <Dialog open={open} handler={() => setOpen(false)} size="lg">
                  <form onSubmit={handleSubmit}>
                    <DialogBody divider className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                      <Input
                        label="Dish Name"
                        name="dishName"
                        value={form.dishName}
                        onChange={handleChange}
                        className="col-span-2"
                        required
                      />
                      <Textarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="col-span-2"
                        required
                      />
                      <Input
                        label="Price"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        type="number"
                        className="col-span-1"
                        required
                      />
                      <div className="flex items-center space-x-2 col-span-1">
                        <Typography variant="h6" color="blue-gray">
                          Enable/Disable
                        </Typography>
                        <Switch
                          defaultChecked={form.enabledisable == "enable" ? true : false}
                          onChange={() => setForm({ ...form, enabledisable: form.enabledisable === 'enable' ? 'disable' : 'enable' })}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
                          Category
                        </label>
                        <CreatableSelect
                          id="category"
                          name="category"
                          isMulti
                          value={(form.category || []).map((key) => ({
                            value: key,
                            label: key.charAt(0).toUpperCase() + key.slice(1)
                          }))}
                          onChange={handleCategoryChange}
                          options={categoryOptions}
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="ingredients">
                          Ingredients
                        </label>
                        <CreatableSelect
                          id="ingredients"
                          name="ingredients"
                          isMulti
                          value={(form.ingredients || []).map((key) => ({
                            value: key,
                            label: key.charAt(0).toUpperCase() + key.slice(1)
                          }))}
                          onChange={handleIngredientsChange}
                          options={ingredientOptions}
                          className="w-full"
                          required
                        />
                      </div>
                      <Input
                        label="Cuisine"
                        name="cuisine"
                        value={form.cuisine}
                        onChange={handleChange}
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Dietary Restrictions"
                        name="dietaryRestrictions"
                        value={form.dietaryRestrictions}
                        onChange={handleChange}
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Calories"
                        name="calories"
                        value={form.calories}
                        onChange={handleChange}
                        type="number"
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Fat Content"
                        name="fatContent"
                        value={form.fatContent}
                        onChange={handleChange}
                        type="number"
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Protein Content"
                        name="proteinContent"
                        value={form.proteinContent}
                        onChange={handleChange}
                        type="number"
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Carbohydrate Content"
                        name="carbohydrateContent"
                        value={form.carbohydrateContent}
                        onChange={handleChange}
                        type="number"
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Fiber Content"
                        name="fiberContent"
                        value={form.fiberContent}
                        onChange={handleChange}
                        type="number"
                        className="col-span-1"
                        required
                      />
                      <Input
                        label="Image Url"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        type="url"
                        className="col-span-1"
                        required
                      />
                    </DialogBody>
                    <DialogFooter className="flex justify-end space-x-2 p-4">
                      <div className="flex space-x-4">
                        <Button variant="gradient" onClick={handelDelete} color="red" className="hover:bg-red-100 transition-colors">
                          Delete
                        </Button>
                      </div>
                      <Button variant="text" color="red" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="gradient" color="green" type="submit">
                        Save
                      </Button>
                    </DialogFooter>
                  </form>
                </Dialog>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default AddMenu
