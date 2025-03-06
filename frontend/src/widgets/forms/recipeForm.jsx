import React from 'react';
import { Input, Textarea, Select, Option, Switch, Button, Checkbox } from '@material-tailwind/react';
import CreatableSelect from 'react-select/creatable';
import ImageCard from "@/widgets/cards/imageCard";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

const RecipeForm = ({
  formData,
  handleSubmit,
  handleChange,
  handleMealTypeChange,
  handleDelete,
  setFormData,
  handleTagChange,
  dietFoodTags,
  handleImageUrlChange,
  addNewImage,
  removeImage,
  setEditingImageIndex,
  editingImageIndex,
  hoveredIndex,
  setHoveredIndex,
  defaultImage,
  setOpen
}) => {
  return (
    <form onSubmit={handleSubmit} className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Column: Plan Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700">Recipe Information</h3>
          <Input
            label="Recipe Name"
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
          <div className="flex flex-row gap-4">
            <Select
              label="Cuisine"
              size="lg"
              name="cuisine"
              value={formData.cuisine}
              onChange={(e) => (setFormData({ ...formData, cuisine: e }))}
            >
              <Option value="Algerian">Algerian</Option>
              <Option value="American">American</Option>
              <Option value="Chinese">Chinese</Option>
              <Option value="Japanese">Japanese</Option>
              <Option value="Indian">Indian</Option>
              <Option value="Italian">Italian</Option>
              <Option value="Greek">Greek</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="Mediterranean">Mediterranean</Option>
              <Option value="Lebanese">Lebanese</Option>
              <Option value="Moroccan">Moroccan</Option>
              <Option value="Turkish">Turkish</Option>
              <Option value="Thai">Thai</Option>
              <Option value="French">French</Option>
              <Option value="British">British</Option>
              <Option value="International">International</Option>
              <Option value="Continental">Continental</Option>

            </Select>
            <Input
              label="Price"
              size="lg"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />

          </div>

          <div className="flex flex-row gap-4">
            <Select
              label="Type"
              size="lg"
              name="type"
              value={formData.type}
              onChange={(e) => (setFormData({ ...formData, type: e }))}
            >

              <Option value="Recipe">Recipe</Option>
              <Option value="Meal">Meal</Option>
              <Option value="Sub-recipe">Sub-recipe</Option>
              <Option value="Sauce">Sauce</Option>
              <Option value="Snack">Snack</Option>
              <Option value="Side">Side</Option>
              <Option value="Drink">Drink</Option>

            </Select>
            <Input
              label="Validity"
              size="lg"
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              required
            />
            <Select
              label="Select Size"
              size="lg"
              name="sizes"
            // value={formData.sizes[0]}
            // onChange={(e) => (setFormData({ ...formData, sizes: [e] }))}
            >


              <Checkbox
                id='Small'
                defaultChecked={formData.sizes.includes('Small')}
                onChange={(e) => {
                  const checked = e.target.checked;  // Extracting checked status from the event
                  setFormData(
                    checked
                      ? { ...formData, sizes: [...new Set([...formData.sizes, 'Small'])] } // Add 'Small' to sizes array
                      : { ...formData, sizes: formData.sizes.filter(s => s !== 'Small') } // Remove 'Small' from sizes array
                  );
                }}
                label='Small'
              />


              <Checkbox
                id='Medium'
                defaultChecked={formData.sizes.includes('Medium')}
                onChange={(e) => {
                  const checked = e.target.checked;  // Extracting checked status from the event
                  setFormData(
                    checked
                      ? { ...formData, sizes: [...new Set([...formData.sizes, 'Medium'])] } // Add 'Medium' to sizes array
                      : { ...formData, sizes: formData.sizes.filter(s => s !== 'Medium') } // Remove 'Medium' from sizes array
                  );
                }}
                label='Medium'
              />



              <Checkbox
                id='Large'
                defaultChecked={formData.sizes.includes('Large')}
                onChange={(e) => {
                  const checked = e.target.checked;  // Extracting checked status from the event
                  setFormData(
                    checked
                      ? { ...formData, sizes: [...new Set([...formData.sizes, 'Large'])] } // Add 'Large' to sizes array
                      : { ...formData, sizes: formData.sizes.filter(s => s !== 'Large') } // Remove 'Large' from sizes array
                  );
                }}
                label='Large'
              />


            </Select>
          </div>
          <div className="flex flex-row justify-between space-x-4 mb-4 border border-blue-gray-200 rounded-[7px] px-3 py-2.5 ">

            <h3 className="text-s font-medium text-gray-700">Recipe Type</h3>
            <div className=" flex gap-6">
              <Switch
                name="Breakfast"
                onChange={handleMealTypeChange}
                // onChange={(e) => (setFormData({ ...formData, mealType: { Breakfast: formmealType.Breakfast === true ? false : true } }))}
                color="bg-gradient-to-br from-gray-900 to-gray-800"
                id="isActive"
                label={<span className="font-medium border-r-2 border-blue-gray-200 pr-2">Breakfast</span>}
                checked={formData.mealType.Breakfast}
              />
              <Switch
                onChange={handleMealTypeChange}
                name="Lunch"
                color="bg-gradient-to-br from-gray-900 to-gray-800"
                id="isActive1"
                label={<span className="font-medium border-r-2 border-blue-gray-200 pr-2">Lunch</span>}
                checked={formData.mealType.Lunch}
              />
              <Switch
                onChange={handleMealTypeChange}
                name="Dinner"
                color="bg-gradient-to-br from-gray-900 to-gray-800"
                id="isActive2"
                label={<span className="font-medium border-r-2 border-blue-gray-200 pr-2">Dinner</span>}
                checked={formData.mealType.Dinner}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Additional Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700">Additional Information</h3>
          <div className="flex flex-row flex-wrap gap-7 items-center">
            {formData.image.map((img, index) => (
              <div
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                key={index}
              >
                <ImageCard ImageUrl={img || defaultImage} />
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
                value={formData.image[editingImageIndex] || ''}
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

            <Select
              label="Category"
              size="lg"
              name="category"
              value={formData.category}
              onChange={(e) => (setFormData({ ...formData, category: e }))}
            >
              <Option value="Standard">Standard</Option>
              <Option value="Vegetarian">Vegetarian</Option>
              <Option value="Non-vegetarian">Non-vegetarian</Option>
            </Select>
            <Select
              label="Diet Type"
              size="lg"
              name="dietType"
              value={formData.dietType}
              onChange={(e) => (setFormData({ ...formData, dietType: e }))}
            >
              <Option value="Ketogenic diet">Ketogenic diet</Option>
              <Option value="Veganism">Veganism</Option>
              <Option value="Low-carbohydrate diet">Low-carbohydrate diet</Option>
              <Option value="Paleolithic diet">Paleolithic diet</Option>
              <Option value="Protein">Protein</Option>
              <Option value="Carnivore diet">Carnivore diet</Option>
              <Option value="Low sodium diet">Low sodium diet</Option>
              <Option value="Whole30">Whole30</Option>
              <Option value="South Beach Diet">South Beach Diet</Option>
              <Option value="Mediterranean diet">Mediterranean diet</Option>
              <Option value="Plant-based diet">Plant-based diet</Option>
              <Option value="Low-fat diet">Low-fat diet</Option>
              <Option value="MIND diet">MIND diet</Option>
              <Option value="Mayo Clinic Diet">Mayo Clinic Diet</Option>
              <Option value="Gluten-free diet">Gluten-free diet</Option>
              <Option value="Intermittent fasting">Intermittent fasting</Option>
              <Option value="Carbohydrate">Carbohydrate</Option>
              <Option value="Weight Watchers">Weight Watchers</Option>
              <Option value="Alkaline diet">Alkaline diet</Option>
              <Option value="Blood type diet">Blood type diet</Option>
              <Option value="Diabetic diet">Diabetic diet</Option>
              <Option value="Raw food diet">Raw food diet</Option>
              <Option value="Standard">Standard</Option>
              <Option value="Vegetarian">Vegetarian</Option>
              <Option value="PCOS">PCOS</Option>
              <Option value="Dairy Free">Dairy Free</Option>
              <Option value="Anti Vata">Anti Vata</Option>

            </Select>
          </div>
          <CreatableSelect
            label="Tags"
            size="lg"
            name="tags"
            value={formData.tags.map(tag => ({ value: tag, label: tag }))}
            onChange={handleTagChange}
            options={dietFoodTags.map(tag => ({ value: tag, label: tag }))}
            isMulti
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between space-x-4">
        <div className="flex space-x-4">
          <Button variant="text" onClick={handleDelete} className="text-red-500">
            Delete
          </Button>
        </div>
        <div className="space-x-4">
          <Button variant="text" onClick={() => setOpen(true)}>
            Cancel
          </Button>
          <Button type="submit" color="bg-gradient-to-br from-gray-900 to-gray-800">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RecipeForm;
