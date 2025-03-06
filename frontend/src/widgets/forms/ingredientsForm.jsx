import api from '@/config';
import { PlusCircleIcon, PlusIcon } from '@heroicons/react/24/solid';
import {
    Button,
    Card,
    Input,
    Option,
    Select,
    Switch,
    Typography
} from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';


const IngredientsForm = ({ RecipeID }) => {
    const [Ingredients, setIngredients] = useState([])
    const [RawIngredients, setRawIngredients] = useState([])
    const [formType, setFormType] = useState(null);
    const [selectedIngredient, setSelectedIngredient] = useState({})
    const [grams, setGrams] = useState(0)
    const [nutritionInfo, setNutritionInfo] = useState({});
    const [totalNutrition, setTotalNutrition] = useState({
        grams: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        cost: 0
    });




    // Access the client
    const queryClient = useQueryClient()

    // Fetching all recipes using useQuery
    const query = useQuery({
        queryKey: ["ingredient", formType], queryFn: async () => {
            if (formType === 'ingredient') {
                const response = await api.get("/raw-ingredients");
                setRawIngredients(response.data);
                return response.data;
            } else if (formType === 'Sub-recipe') {
                const response = await api.get("/recipes?type=Sub-recipe");

                setRawIngredients(response.data.filter(recipe => recipe._id !== RecipeID)); //remove same recipe where add ingredients 
                return response.data;
            } else if (formType === 'Meal') {
                const response = await api.get("/recipes?type=Meal");
                setRawIngredients(response.data.filter(recipe => recipe._id !== RecipeID));//remove same recipe where add ingredients 
                return response.data;
            } else if (formType === 'Sauce') {
                const response = await api.get("/recipes?type=Sauce");
                setRawIngredients(response.data.filter(recipe => recipe._id !== RecipeID));//remove same recipe where add ingredients 
                return response.data;
            }
            else {
                return "form type is Null"
            }
        },

    })
    const query1 = useQuery({
        queryKey: ["ingredient1"], queryFn: async () => {
            const response = await api.get("/ingredients?recipe=" + RecipeID);
            setIngredients(response.data);
            return response.data;
        }

    })
    // Mutation for creating or updating recipes
    const mutation = useMutation(
        {
            mutationFn: async (data) => {

                return await api.post("/ingredients", data);
            },
            onSuccess: () => {
                // Invalidate and refetch recipes
                queryClient.invalidateQueries(["ingredient1"]);
                setOpen(true);  // Close the form after successful submission
            },
        }
    );
    const handleFormTypeChange = (type) => {
        setFormType(type);
        setSelectedIngredient({});
        setGrams(0)
    };

    const handleSubmit = () => {
        if (!selectedIngredient.name || grams <= 0) {
            alert("Please select an ingredient and enter a valid gram value.");
            return;
        }

        const data = {
            recipe: RecipeID,  // Default Recipe ID from the schema
            grams,
            rawIngredients: formType === "ingredient" ? selectedIngredient._id : null,
            subRecipe: formType !== "ingredient" ? selectedIngredient._id : null,
        };

        mutation.mutate(data);
        handleFormTypeChange(null)
    };

    const rawIngredientsCalc = (item, grams) => {
        const scale = grams / 100;
        return {
            calories: Math.round((item.calorie * scale) * 100) / 100,    //Math.round conver round number to remove float value
            protein: Math.round((item.protein * scale) * 100) / 100,
            carbs: Math.round((item.carb * scale) * 100) / 100,
            fat: Math.round((item.fat * scale) * 100) / 100,
        };

    }
    const subRecipeCalc = async (item, grams) => {
        const calculateNutritionalInfo = async (ingredient, ingredientGrams) => {
            if (ingredient.rawIngredients) {
                // Raw ingredient case
                const scale = ingredientGrams / 100;
                return {
                    calories: ingredient.rawIngredients.calorie * scale,
                    protein: ingredient.rawIngredients.protein * scale,
                    carbs: ingredient.rawIngredients.carb * scale,
                    fat: ingredient.rawIngredients.fat * scale,
                };
            } else if (ingredient.subRecipe) {
                // Sub-recipe case
                return await subRecipeCalc(ingredient.subRecipe, ingredientGrams);
            }
            // If neither rawIngredients nor subRecipe are present, return zeroes
            return { calories: 0, protein: 0, carbs: 0, fat: 0 };
        };

        try {
            const response = await api.get("/ingredients?recipe=" + item._id);
            const ingredients = response.data;

            let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
            let totalGrams = 0;

            for (const ingredient of ingredients) {
                const nutrition = await calculateNutritionalInfo(ingredient, ingredient.grams);
                totalGrams += ingredient.grams;
                Object.keys(totalNutrition).forEach(key => {
                    totalNutrition[key] += nutrition[key];
                });
            }

            // Scale the nutrition based on the requested grams
            const scale = grams / totalGrams;
            Object.keys(totalNutrition).forEach(key => {
                totalNutrition[key] *= scale;
                // Round to 2 decimal places
                totalNutrition[key] = Math.round(totalNutrition[key] * 100) / 100;
            });
            return totalNutrition;
        } catch (error) {
            console.error("Error calculating sub-recipe nutrition:", error);
            return { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
    };
    useEffect(() => {
        const calculateNutrition = async () => {
            const newNutritionInfo = {};
            let newTotalNutrition = {
                grams: 0,
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                cost: 0
            };

            for (const ingredient of Ingredients) {
                let ingredientNutrition;
                if (ingredient.rawIngredients) {
                    ingredientNutrition = rawIngredientsCalc(ingredient.rawIngredients, ingredient.grams);
                } else if (ingredient.subRecipe) {
                    ingredientNutrition = await subRecipeCalc(ingredient.subRecipe, ingredient.grams);
                }

                newNutritionInfo[ingredient._id] = ingredientNutrition;

                // Add to total nutrition
                newTotalNutrition.grams += ingredient.grams;
                newTotalNutrition.calories += ingredientNutrition.calories;
                newTotalNutrition.protein += ingredientNutrition.protein;
                newTotalNutrition.carbs += ingredientNutrition.carbs;
                newTotalNutrition.fat += ingredientNutrition.fat;
                newTotalNutrition.cost += ingredientNutrition.cost || 0; // Assuming cost is calculated somewhere
            }

            // Round all total nutrition values to 2 decimal places
            Object.keys(newTotalNutrition).forEach(key => {
                newTotalNutrition[key] = Math.round(newTotalNutrition[key] * 100) / 100;
            });

            setNutritionInfo(newNutritionInfo);
            setTotalNutrition(newTotalNutrition);
        };

        calculateNutrition();
    }, [Ingredients]);

    return (
        <>
            <div className="flex p-2 rounded-md mt-10"> <h2 className="text-2xl font-semibold">Ingredients Information</h2></div>
            <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {/* right Column: Plan Information */}
                    {/* <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-700">Label Information</h3>
                        <div className="flex flex-row gap-4">
                            <Select label="Select Label">
                                <Option>Standard </Option>
                                <Option>Rounded</Option>
                            </Select>
                        </div>
                        <div className="flex flex-col space-x-4 mb-4 border border-blue-gray-200 rounded-[7px] px-3 py-2.5 ">
                            <h3 className="text-s font-medium text-gray-700 mb-2">Select lable Tagline</h3>
                            <Switch
                                color="green"
                                label={<span className="font-normal">Enjoy guilt free!</span>}
                            />
                            <Switch
                                color="green"

                                label={<span className="font-normal">Remove lid, heat, enjoy!</span>}
                            />
                            <Switch
                                color="green"
                                label={<span className="font-normal">Eat Cold!</span>}
                            />
                        </div>
                    </div> */}
                </div>
                <div className='flex flex-row gap-7 mt-7'>
                    <Button onClick={() => handleFormTypeChange("ingredient")} className='flex justify-center items-center gap-3'><PlusCircleIcon height={30} width={30} />Ingredients</Button>
                    <Button onClick={() => handleFormTypeChange("Sub-recipe")} className='flex justify-center items-center gap-3'><PlusCircleIcon height={30} width={30} />Sub Recipe</Button>
                    <Button onClick={() => handleFormTypeChange("Meal")} className='flex justify-center items-center gap-3'><PlusCircleIcon height={30} width={30} />Meal</Button>
                    <Button onClick={() => handleFormTypeChange("Sauce")} className='flex justify-center items-center gap-3'><PlusCircleIcon height={30} width={30} />Sauce</Button>
                </div>
                <div className={`mt-7 ${formType === null ? 'hidden' : ''}`}>
                    <form className="h-full">
                        <table className="w-full min-w-max table-auto text-left">
                            <tbody>

                                <tr className="even:bg-blue-gray-50/50">
                                    <td className="p-4">
                                        <CreatableSelect
                                            label="Select Ingredients"
                                            size="lg"
                                            name="ingredients"
                                            onChange={(option) => setSelectedIngredient(option.value)}
                                            options={RawIngredients.map(ingredient => ({ value: ingredient, label: ingredient.name }))}
                                            required
                                        />
                                    </td>
                                    <td className="p-4">
                                        <Input
                                            onChange={(e) => { setGrams(e.target.value) }}
                                            label="Grams"
                                            type='number'
                                            size="sm"
                                            value={grams}
                                            name="Grams"
                                            required
                                        />
                                    </td>
                                    <td className="p-4">
                                        <Button onClick={handleSubmit} size='sm' className='flex justify-center items-center gap-1'><PlusIcon height={20} width={20} />Add</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </form>
                </div>

                <div className="mt-7">
                    {/* Tabular Data */}
                    <Card className="h-full w-full overflow-scroll">
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Name
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Grams
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Calories
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Proteign
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Carbs
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Fat
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Cost
                                        </Typography>
                                    </th>
                                    <th
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-medium leading-none opacity-70"
                                        >
                                            Action
                                        </Typography>
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr className="even:bg-blue-gray-50/50">
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            Total Nutrition
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            {totalNutrition.grams}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            {totalNutrition.calories}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            {totalNutrition.protein}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            {totalNutrition.carbs}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            {totalNutrition.fat}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="lead" color="green" className="font-normal">
                                            37
                                        </Typography>
                                    </td>

                                </tr>
                                {Ingredients.map((value, index) => (
                                    <tr key={index} className="even:bg-blue-gray-50/50 hover:bg-green-100">
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {value.rawIngredients ? value.rawIngredients.name : value.subRecipe.name}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {value.grams}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {nutritionInfo[value._id]?.calories || 0}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {nutritionInfo[value._id]?.protein || 0}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {nutritionInfo[value._id]?.carbs || 0}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {nutritionInfo[value._id]?.fat || 0}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Button onClick={async () => { await api.delete("/ingredients/" + value._id) }}>Delete</Button>
                                        </td>
                                        <td className="p-4">

                                        </td>




                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default IngredientsForm


