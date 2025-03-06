import ImageCard from "@/widgets/cards/imageCard";
import { Input, Textarea } from '@material-tailwind/react';
import { useEffect, useState } from "react";
import Button from "../layout/button";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

const MealPalnForm = ({ mealPlan, onSubmit }) => {
  const [formData, setFormData] = useState(mealPlan || {})

  // Populate form with mealPlan data when available
  useEffect(() => {
    if (mealPlan) {
      setFormData(mealPlan);
      console.log(mealPlan)
    }
  }, [mealPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const handleImageUrlChange = (e, imageIndex) => {
    const newImages = [...formData.images];
    newImages[imageIndex] = e.target.value;
    setFormData({ ...formData, images: newImages });
  };

  const addNewImage = () => {
    setFormData(prev => ({

      ...prev,
      images: [...prev.images || [], ''],

    }
    ));
    setEditingImageIndex(formData.images.length);
  };



  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setEditingImageIndex(null);
  };















  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("----submit", formData)
    onSubmit(formData);  // Call the onSubmit function passed from the parent
  };


  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700">Plan Information</h3>
          <Input
            label="Meal Plan Name"
            size="lg"
            defaultValue={mealPlan ? mealPlan.name : ''}
            name="name"
            onChange={handleChange}
            required
          />
          {/* <Textarea
            label="Caption"
            size="md"
            defaultValue={mealPlan ? mealPlan.caption : ''}
            name="caption"
            onChange={handleChange}
            required
          /> */}
          <Textarea
            label="Short Brief"
            size="lg"
            defaultValue={mealPlan ? mealPlan.shortBrief : ''}
            name="shortBrief"
            onChange={handleChange}
            required
          />
          <Textarea
            label="Description"
            size="lg"
            defaultValue={mealPlan ? mealPlan.description : ''}
            name="description"
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700">Additional Information</h3>
          <div className="flex flex-row flex-wrap gap-7 items-center">
            {formData.images?.map((img, index) => (
              <div
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                key={index}
              >
                <ImageCard ImageUrl={img || 'https://i.postimg.cc/cH3F5y3f/2419-Kachumber-Salad-Cucumber-Salad-result.webp'} />
                {hoveredIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <Button variant="text" size="sm"><PencilIcon onClick={() => setEditingImageIndex(index)} className="h-7 w-7" color="white" /></Button>
                    <Button variant="text" size="sm" ><TrashIcon onClick={() => removeImage(index)} className="h-7 w-7" color="white" /></Button>
                  </div>
                )}

              </div>
            ))}
            <Button
              className="h-48 w-48 bg-transparent flex border-2 border-green-500 border-dashed rounded-lg  items-center justify-center"
              onClick={addNewImage}
            >
              <PlusCircleIcon className="h-12 w-12" color="black" />
            </Button>
          </div>
          {editingImageIndex !== null && (
            <div className="flex flex-row gap-4">
              <Input
                label={`Image URL for Image ${editingImageIndex + 1}`}
                size="lg"
                value={formData.images[editingImageIndex] || ''}
                onChange={(e) => handleImageUrlChange(e, editingImageIndex)}
                className="mb-2"
              />
              <Button
                color="blue"
                size="sm"
                onClick={() => setEditingImageIndex(null)}
              >
                Add Image
              </Button>
            </div>
          )}
          <div className="flex flex-row gap-4">

            <Input
              label="Price"
              size="lg"
              defaultValue={mealPlan ? mealPlan.startingPrice : ''}
              name="startingPrice"
              onChange={handleChange}
              required
            />
            {/* <Input
              label="Price"
              size="lg"
              name="price"
              /> */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between space-x-4">
        <div className="space-x-4">
          <Button variant="text" className="text-red-500">
            Delete
          </Button>
        </div>
        <div className=" flex space-x-4">
          <Button variant="text" >
            Cancel
          </Button>
          <Button type="submit" color="border-blue-gray-500 border rounded-lg">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MealPalnForm;
