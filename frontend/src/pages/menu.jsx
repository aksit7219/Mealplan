import { fetchMenus } from '@/redux/reducers/menuSlice';
import { ChevronDoubleRightIcon, EyeDropperIcon, PencilIcon } from '@heroicons/react/24/solid';
import {
    Checkbox,
    Input,
    Option,
    Select,
    Switch
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
const Menu = ({ all }) => {
    // const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { menus, status: menuStatus, error: menuError } = useSelector((state) => state.menu)
    // const { planBundles, status: bundleStatus, error: bundleError } = useSelector((state) => state.planBundle);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (true) {
            if (menuStatus === 'idle') {
                dispatch(fetchMenus());
                // dispatch(fetchMealPlanData());

            }
        }
        // else {
        //     if (menuStatus === 'idle') {
        //         dispatch(fetchMenus());
        //     }
        // }
    }, [menuStatus, dispatch]);



    return (
        <>   <div className=" rounded-lg  p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    {/* Date Picker
                        <div className="relative">
                            <div className="flex items-center space-x-3 px-4 py-2.5 
                                rounded-xl  hover:bg-gray-100 
                                transition-colors group">
                                <Input
                                    label="Meal Date"
                                    name="mealDate"
                                    type='date'
                                />
                            </div>
                        </div> */}

                    {/* Meal Type Selector
                        <div className="relative">
                            <div className="flex items-center space-x-3 px-4 py-2.5 
                                rounded-xl  hover:bg-gray-100 
                                transition-colors group">
                                <Select
                                    label="Meal Planes"
                                >
                                    <Option value="breakFast">Break Fast</Option>
                                    <Option value="amSnack">AM Snack</Option>
                                    <Option value="snack">Snack</Option>
                                    <Option value="lunch">Lunch</Option>
                                    <Option value="lunchSide">Lunch Side</Option>
                                    <Option value="pmSnack">PM Snack</Option>
                                    <Option value="dinner">Dinner</Option>
                                    <Option value="dinnerSide">Dinner Side</Option>
                                    <Option value="side">Side</Option>
                                    <Option value="drink">Drink</Option>
                                </Select>
                            </div>
                        </div> */}

                </div>
                {/* Search Bar
                    <div className="flex items-center  rounded-lg">
                        <div className="p-2 rounded-md hover:bg-gray-100 ">
                            <Input
                                label="Search By Name"
                                name="search"
                                type='text'
                            />
                        </div>
                    </div> */}
            </div>
        </div>

            {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"></div> */}
            {/* card start */}
            <div className='flex flex-wrap mx-4 items-stretch'>
                {menus.map((menu, index) => (
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
                                        alt={menu.name}
                                    />
                                </div>
                            </div>

                            {/* Content Section - Matching reference design */}
                            <div className="relative text-white px-4 sm:px-4     pb-6 mt-6">
                                <div className="flex flex-col space-y-4">
                                    {/* Title and Plans Section */}
                                    <div className="flex items-center justify-between">
                                        <span className="block font-semibold text-lg">{menu.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300 mb-2">{menu.description}</span>
                                    </div>


                                    {/* Actions Row */}
                                    <div className="flex items-center gap-2">
                                        <Link to={`manage/${menu._id} `} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                            Manage
                                        </Link>
                                        <button className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>

                                        <div className="flex items-center">
                                            <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-500/10 text-yellow-500 text-sm rounded-md">
                                                <span className="text-yellow-500 text-sm">Plans</span>
                                                <ChevronDoubleRightIcon className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Your existing controls, now below the new elements */}
                                    <div className="flex justify-center gap-6 border-t border-gray-700">
                                        <Switch name="forWeb" color="blue-gray-900" id="forWeb" defaultValue={false} />
                                        <Checkbox color="green" defaultChecked />
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

export default Menu;