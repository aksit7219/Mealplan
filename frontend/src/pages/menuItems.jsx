import { addMenuItem, fetchMenuItems } from '@/redux/reducers/menuItemsSlice';
import { fetchRecipeData } from '@/redux/reducers/recipeSlice';
import { ChevronDoubleRightIcon, PencilIcon } from '@heroicons/react/24/solid';
import {
    Checkbox,
    Input,
    Option,
    Select,
    Switch
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const MenuItems = ({ all }) => {
    const { MenuId } = useParams();
    const [MenuDate, setMenuDate] = useState(new Date().toISOString());
    const [MenuItem, setMenuItem] = useState({
        "menu": MenuId,
        "date": MenuDate,
        "items": {
            "breakfast": [],
            "amsnack": [],
            "lunch": [],
            "dinner": [],
            "drink": []
        },
        "createdBy": "64f84e3f2c7f1a1e7a6e4f2d"
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [RecipeTypeCurrent, setRecipeTypeCurrent] = useState('breakfast');
    const { menus, status: menuStatus, error: menuError } = useSelector((state) => state.menu);
    const { recipes, status: recipeStatus, error: recipeError } = useSelector((state) => state.recipe);
    const { menuItems, status: menuItemStatus, error: menuItemError } = useSelector((state) => state.menuItem);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recipeStatus === 'idle') {
            dispatch(fetchRecipeData());
        }
    }, [recipeStatus, dispatch]);

    useEffect(() => {
        if (menuItemStatus === 'idle') {
            dispatch(fetchMenuItems());
        }
    }, [menuItemStatus, dispatch]);

    useEffect(() => {
        const existingMenuItem = menuItems.find(menu => menu.date === MenuDate);
        if (existingMenuItem) {
            setMenuItem(existingMenuItem);
        } else {
            setMenuItem({
                "menu": MenuId,
                "date": MenuDate,
                "items": {
                    "breakfast": [],
                    "amsnack": [],
                    "lunch": [],
                    "dinner": [],
                    "drink": []
                },
                "createdBy": "64f84e3f2c7f1a1e7a6e4f2d"
            });
        }
    }, [menuItems, MenuDate, MenuId]);

    const handleInclude = (e, recipe, mealType) => {
        const { name, value, checked } = e.target;
        setMenuItem((prevState) => ({
            ...prevState,
            menu: MenuId,
            date: MenuDate,
            items: {
                ...prevState.items,
                [mealType]: checked ? [
                    ...prevState.items[mealType],
                    {
                        dishId: recipe._id,
                        name: recipe.name,
                        isInclude: checked,
                        isDefault: false,
                        createdBy: "64f84e3f2c7f1a1e7a6e4f2d"
                    }
                ] : prevState.items[mealType].filter((item) => item.dishId !== recipe._id)
            }
        }));
        const existingMenuItem = menuItems.find(menu => menu.date === MenuDate);
        if (existingMenuItem) {
            dispatch(updateMenuItem({ menuId: existingMenuItem._id, MenuItem }));
        } else {
            dispatch(addMenuItem(MenuItem));
        }
    };

    const handleDefault = (e, recipe, mealType) => {
        const { name, value, checked } = e.target;
        setMenuItem((prevState) => ({
            ...prevState,
            menu: MenuId,
            date: MenuDate,
            items: {
                ...prevState.items,
                [mealType]: [...prevState.items[mealType]].map((item) =>
                    item.dishId === recipe._id
                        ? { ...item, isDefault: checked }
                        : { ...item, isDefault: false }
                )
            }
        }));
        const existingMenuItem = menuItems.find(menu => menu.date === MenuDate);
        if (existingMenuItem) {
            dispatch(updateMenuItem({ menuId: existingMenuItem._id, MenuItem }));
        } else {
            dispatch(addMenuItem(MenuItem));
        }
    };


    return (
        <>   <div className=" rounded-lg  p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    {/* Date Picker */}
                    <div className="relative">
                        <div className="flex items-center space-x-3 px-4 py-2.5 
                        rounded-xl  hover:bg-gray-100 
                        transition-colors group">
                            <Input
                                onChange={(e) => setMenuDate(new Date(e.target.value).toISOString())}
                                label="Meal Date"
                                name="mealDate"
                                type='date'
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {/* Meal Type Selector */}
                    <div className="relative">
                        <div className="flex items-center space-x-3 px-4 py-2.5 
                        rounded-xl  hover:bg-gray-100 
                        transition-colors group">
                            <Select
                                label="Meal Type"
                                onChange={(e) => setRecipeTypeCurrent(e)}
                            >
                                <Option defaultChecked value="Recipe">Break Fast</Option>
                                <Option value="Snack">AM Snack</Option>
                                <Option value="Snack">Snack</Option>
                                <Option value="Meal">Lunch</Option>
                                <Option value="Side">Lunch Side</Option>
                                <Option value="Snack">PM Snack</Option>
                                <Option value="Meal">Dinner</Option>
                                <Option value="Side">Dinner Side</Option>
                                <Option value="Side">Side</Option>
                                <Option value="Drink">Drink</Option>
                            </Select>
                        </div>
                    </div>

                </div>
                {/* Search Bar */}
                <div className="flex items-center  rounded-lg">
                    <div className="p-2 rounded-md hover:bg-gray-100 ">
                        <Input
                            label="Search By Name"
                            name="search"
                            type='text'
                        />
                    </div>
                </div>
            </div>
        </div>

            {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"></div> */}
            {/* card start */}
            <div className='flex flex-wrap mx-4 items-stretch'>
                {recipes.filter(recipe => recipe.type === RecipeTypeCurrent).map((recipe, index) => (
                    <div className="p-4 xl:w-1/5">
                        <div className="flex flex-col h-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-lg">
                            {/* Keep your existing background patterns */}
                            <div className="relative flex-grow">
                                <svg className="absolute bottom-0 left-0 mb-8 w-full h-auto" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                                    <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
                                    <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
                                </svg>

                                {/* Image Section */}
                                <div className="relative pt-4 px-4 sm:px-4
                            ">
                                    <div className="absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                                        style={{
                                            background: 'radial-gradient(black, transparent 60%)',
                                            transform: 'rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)',
                                            opacity: 0.2
                                        }}></div>
                                    <img
                                        className="w-32 h-36 sm:w-40 sm:h-46 md:w-48 md:h-54 lg:w-[200px] lg:h-[150px] object-cover rounded-lg shadow-md"
                                        src="https://plus.unsplash.com/premium_photo-1690561082590-095fee157afd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt={recipe.name}
                                    />
                                </div>
                            </div>

                            {/* Content Section - Matching reference design */}
                            <div className="relative text-white px-4 sm:px-4     pb-6 mt-6">
                                <div className="flex flex-col space-y-4 ">
                                    {/* Title and Plans Section */}
                                    <div className="flex items-center justify-between">
                                        <span className="block font-semibold text-lg">{recipe.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300  mb-2">{recipe.category}</span>
                                    </div>

                                    {/* Your existing controls, now below the new elements */}
                                    <div className="flex justify-center items-center border-t gap-3 border-gray-700 ">

                                        <div className='flex justify-center items-center gap-3 '>
                                            Include<Switch name="isInclude" color="blue-gray-900" onChange={(e) => handleInclude(e = e, recipe = recipe)} defaultValue={false} />
                                        </div>
                                        <div className='flex justify-center items-center'>
                                            |
                                        </div>
                                        <div className='flex justify-center items-center gap-3'>
                                            Default<Checkbox name='isDefault' onChange={(e) => handleDefault(e = e, recipe = recipe)} color="green" defaultChecked />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


            </div>
        </>
    );
};

export default MenuItems;