import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMealPlanData, deleteMealPlan, updateMealPlan } from '../redux/reducers/mealPlanSlice';
import PlanCard from '@/widgets/cards/planCard';
import Button from '@/widgets/layout/button';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const MealPlan = () => {
  const dispatch = useDispatch();
  const { mealPlans, status, error } = useSelector((state) => state.mealPlan);

  // Fetch meal plans on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMealPlanData());
    }
  }, [status, dispatch]);

  // Conditional rendering based on status
  if (status === 'loading') {
    return <div>Loading meal plans...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleDelete = (id) => {
    console.log('deleted')
    // Confirm deletion with the user
    if (window.confirm(`Are you sure you want to delete the meal plan "${id}"?`)) {
      dispatch(deleteMealPlan(id)); // Call the delete function passed as a prop
    }
  };

  const handleEdit = (mealPlan) => {
    setEditingMealPlan(mealPlan);
    setMealPlanName(mealPlan.name);
  };

  const handleUpdate = () => {
    if (editingMealPlan) {
      console.log(editingMealPlan)
      dispatch(updateMealPlan({ id: editingMealPlan._id, mealPlan: { name: mealPlanName } }));
      setEditingMealPlan(null);
      setMealPlanName('');
    }
  };

  return (
    <>
      <Link to={'/mealplans/create'}><Button variant='text'><PlusCircleIcon className="text-blue-gray-500" height={45} width={45} />Add New</Button></Link>
      <div className="mt-2 mb-8 flex-row gap-12">
        <div className="flex flex-wrap gap-4 items-stretch">
          {mealPlans.length > 0 ? mealPlans.map((plan, index) => (
            <PlanCard plan={plan} key={index} title={plan.name} shortbrief={plan.shortBrief} handleDelete={handleDelete} planranges={plan.planRanges} url={`/mealplans/${encodeURIComponent(plan.name.replace(/\s+/g, '-'))}`} />
          )) : (
            <p style={{ color: '#777' }}>No meal plans available.</p>
          )}
        </div>
      </div>
    </>

  );
};

export default MealPlan;
