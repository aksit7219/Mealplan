import { fetchMealPlanData } from '@/redux/reducers/mealPlanSlice';
import { fetchPlanBundleData, fetchPlanBundlesByMealPlan } from '@/redux/reducers/planBundleSlice';
import BundleCard from "@/widgets/cards/bundleCard";
import { Loader } from '@/widgets/layout';
import Button from '@/widgets/layout/button';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';

const MealPlanBundle = ({ all }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { planBundles, status: bundleStatus, error: bundleError } = useSelector((state) => state.planBundle);
    const { mealPlans, status: mealPlanStatus, error: mealPlanError } = useSelector((state) => state.mealPlan);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (all === true) {
            if (bundleStatus === 'idle') {
                dispatch(fetchPlanBundleData());
                dispatch(fetchMealPlanData());

            }
        }
        else {
            if (mealPlanStatus === 'idle') {
                dispatch(fetchMealPlanData());
            }
        }
    }, [mealPlanStatus, dispatch]);

    useEffect(() => {
        const fetchBundles = async () => {
            if (mealPlans.length > 0) {
                const name = id.replace(/-/g, ' ');
                const foundPlan = mealPlans.find((plan) => plan.name === name);
                if (foundPlan) {
                    try {
                        await dispatch(fetchPlanBundlesByMealPlan(foundPlan._id)).unwrap();
                    } catch (err) {
                        setError("Failed to fetch bundles. Please try again.");
                    }
                } else {
                    setError("Meal plan not found. Please check the URL and try again.");
                }
            }
        };

        if (mealPlanStatus === 'succeeded') {
            fetchBundles();
        }
    }, [id, mealPlans, mealPlanStatus, dispatch, navigate]);

    if (mealPlanStatus === 'loading' || bundleStatus === 'loading') {
        return <div className="flex flex-col items-center justify-center h-full text-center p-4"><Loader /></div>;
    }

    if (mealPlanStatus === 'failed') {
        return <div className="flex flex-col items-center justify-center h-full text-center p-4 text-red-500">Error loading meal plans: {mealPlanError}</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <p className="text-red-500 mb-4">{error}</p>
                <Link to={`/mealplans/${id}/create`}>
                    <Button className="flex items-center justify-center">
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Create New Bundle
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-6 rounded-lg overflow-auto">
            {planBundles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <p className="mb-4">No bundles found for this meal plan.</p>
                    <Link to="create">
                        <Button>
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Create New Bundle
                        </Button>
                    </Link>
                </div>
            ) : (<>
                <div className="flex items-end justify-end">
                    <Link to={`/mealplans/${id}/create`}>
                        <Button className="flex items-center justify-center">
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Create New Bundle
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pt-10">
                    {planBundles.map((bundle) => (
                        <Link key={bundle._id} to={all === true && bundle.mealPlan ? `/mealplans/${encodeURIComponent(bundle.mealPlan.name.replace(/\s+/g, '-'))}/${bundle._id}/` : `${bundle._id}/`
                        }
                        >
                            <BundleCard bundle={bundle} />
                        </Link>
                    ))}
                </div>
            </>
            )}
        </div>
    );
};

export default MealPlanBundle;