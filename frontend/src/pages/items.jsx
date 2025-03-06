import api from "@/config";
import RecipeCard from "@/widgets/cards/recipeCard";
import IngredientsForm from "@/widgets/forms/ingredientsForm";
import RecipeForm from "@/widgets/forms/recipeForm";
import {
  Button,
  ButtonGroup,
  Input
} from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { debounce } from 'lodash';
const dietFoodTags = [
  "Carb Conscious",
  "Gluten Free",
  "High Protein",
  "Low Sodium",
  "Milk Free",
  "Nut Free",
  "No Hormones or Antibiotics",
  "Soy Free",
];

const defaultImage = "https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png";
const Items = () => {

  // Access the client
  const queryClient = useQueryClient() 
  // Fetching all recipes using useQuery
  const query = useQuery({
    queryKey: ['recipe'], queryFn: async () => {
      const response = await api.get("/recipes?type=!Recipe");
      setRecipeAll(response.data);
      return response.data;
    }
  });
  // Mutation for creating or updating recipes
  const mutation = useMutation(
    {
      mutationFn: async (formData) => {
        if (isEditing) {
          return await api.put("/recipes/" + SelectedRecipe._id, formData);
        } else {
          return await api.post("/recipes/", formData);
        }
      },
      onSuccess: () => {
        // Invalidate and refetch recipes
        queryClient.invalidateQueries(['recipe']);
        setOpen(true);  // Close the form after successful submission
      },
    }
  );

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(true);
  const [SelectedRecipe, setSelectedRecipe] = useState({});
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [RecipeAll, setRecipeAll] = useState([]); // Moved this line up


  const handleOpen = (recipe) => {
    setOpen(false);
    if (!recipe) {
      setFormData({
        name: '',
        description: '',
        type: '',
        cuisine: '',
        category: '',
        dietType: '',
        price: '',
        validity: '',
        tags: [],
        image: [],
        sizes: [],
        mealType: {
          Breakfast: 'false',
          Lunch: 'false',
          Dinner: 'false'
        },
        restaurant: '66b4888bdfdd074e47502f7a',
      });
      setIsEditing(false);
    } else {
      setSelectedRecipe(recipe);
      setFormData({
        name: recipe.name || '',
        description: recipe.description || '',
        type: recipe.type || '',
        cuisine: recipe.cuisine || '',
        category: recipe.category || '',
        dietType: recipe.dietType || '',
        price: recipe.price || '',
        validity: recipe.validity || '',
        tags: recipe.tags || [],
        image: recipe.image || [],
        sizes: recipe.sizes || [],
        mealType: recipe.mealType || {
          Breakfast: 'false',
          Lunch: 'false',
          Dinner: 'false'
        },
        restaurant: recipe.restaurant || '66b4888bdfdd074e47502f7a',
      });
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleTagChange = (selectedOptions) => {
    setFormData({
      ...formData,
      tags: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    });
  };

  const handleImageUrlChange = (e, imageIndex) => {
    const newImages = [...formData.image];
    newImages[imageIndex] = e.target.value;
    setFormData({ ...formData, image: newImages });
  };

  const addNewImage = () => {
    setFormData(prev => ({
      ...prev,
      image: [...prev.image, '']
    }));
    setEditingImageIndex(formData.image.length);
  };

  const removeImage = (index) => {
    const newImages = formData.image.filter((_, i) => i !== index);
    setFormData({ ...formData, image: newImages });
    setEditingImageIndex(null);
  };

  const handleMealTypeChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      mealType: {
        ...prevFormData.mealType,
        [name]: checked,
      },
    }));
  };

  const handleDelete = async () => {
    if (SelectedRecipe._id) {
      await api.delete("/recipes/" + SelectedRecipe._id);
      queryClient.invalidateQueries(['recipe']);
      setOpen(true);
    }
  };
  // Effect to filter recipes based on search term
  useEffect(() => {
    const debouncedFilter = debounce(() => {
      if (searchTerm) {
        setFilteredRecipes(RecipeAll.filter(recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase())));
      } else {
        setFilteredRecipes(RecipeAll);
      }
    }, 300);

    debouncedFilter();

    return () => {
      debouncedFilter.cancel();
    };
  }, [searchTerm, RecipeAll]);

  return (
    <div className="mt-2 mb-8 flex-row gap-12">
      <div className="flex flex-row justify-between">
        <Button className="bg-[#436850]" onClick={() => handleOpen(null)}>
          Add Dish
        </Button>
        <div className="mr-auto md:mr-4 md:w-56">
        <Input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        </div>
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => setRecipeAll(query.data.filter(recipe => recipe.type === 'Meal'))}
            className={RecipeAll.every(recipe => recipe.type === 'Meal') ? "border-[#436850] bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            Meal
          </Button>
          <Button
            onClick={() => setRecipeAll(query.data.filter(recipe => recipe.type === 'Sub-recipe'))}
            className={RecipeAll.every(recipe => recipe.type === 'Sub-recipe') ? "border-[#436850] bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            Sub-recipe
          </Button>
          <Button
            onClick={() => setRecipeAll(query.data.filter(recipe => recipe.type === 'Sauce'))}
            className={RecipeAll.every(recipe => recipe.type === 'Sauce') ? "border-[#436850] bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            Sauce
          </Button>
          <Button
            onClick={() => setRecipeAll(query.data.filter(recipe => recipe.type === 'Snack'))}
            className={RecipeAll.every(recipe => recipe.type === 'Snack') ? "border-[#436850] bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            Snack
          </Button>
          <Button
            onClick={() => setRecipeAll(query.data.filter(recipe => recipe.type === 'Side'))}
            className={RecipeAll.every(recipe => recipe.type === 'Side') ? "border-[#436850] bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            Side
          </Button>
          <Button
            onClick={() => setRecipeAll(query.data.filter(recipe => recipe.type === 'Drink'))}
            className={RecipeAll.every(recipe => recipe.type === 'Drink') ? "border-2 border-[#436850]  bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            Drink
          </Button>
          <Button
            onClick={() => setRecipeAll(query.data)}
            className={RecipeAll === query.data ? "border-[#436850] bg-[#436850] text-white" : "border-[#436850] text-blue-500"}
          >
            All
          </Button>
        </ButtonGroup>
      </div>

      {open ? (
        <div className="flex flex-wrap -mx-4 items-stretch">
          {(searchTerm ? filteredRecipes : RecipeAll).map((recipe, index) => (
            <RecipeCard key={index}
              bgColor="bg-gradient-to-br from-gray-900 to-gray-800"
              imageSrc="./public/img/abhishek-hajare-GiB3TUjWIks-unsplash-removebg-preview.png"
              label={recipe.type}
              title={recipe.name}
              price={recipe.price}
              textColor="text-[#436850]"
              handelOpen={() => handleOpen(recipe)}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">General Information</h2></div>
          <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">

            <RecipeForm
              addNewImage={addNewImage}
              dietFoodTags={dietFoodTags}
              editingImageIndex={editingImageIndex}
              formData={formData}
              handleChange={handleChange}
              handleDelete={handleDelete}
              handleImageUrlChange={handleImageUrlChange}
              handleMealTypeChange={handleMealTypeChange}
              handleSubmit={handleSubmit}
              handleTagChange={handleTagChange}
              hoveredIndex={hoveredIndex}
              removeImage={removeImage}
              setEditingImageIndex={setEditingImageIndex}
              setFormData={setFormData}
              setHoveredIndex={setHoveredIndex}
              setOpen={setOpen}
            />
          </div>

          <IngredientsForm RecipeID={SelectedRecipe._id} />
        </>
      )}
    </div>
  );
}

export default Items;
