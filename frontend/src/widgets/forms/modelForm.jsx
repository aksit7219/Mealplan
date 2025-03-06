
import { Typography, Input, Button } from '@material-tailwind/react';

const ModelForm = ({ formData, handleChange, handleSave, title, submitButtonText }) => {
  return (
    <div className="space-y-4 pb-6">
      <Typography variant="h4" color="blue-gray">
        {title}
      </Typography>
      <Typography className="mt-1 font-normal text-gray-600">
        Keep your records up-to-date and organized.
      </Typography>
      <div>
        <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
          Name
        </Typography>
        <Input
          color="gray"
          size="lg"
          placeholder="eg. Chicken Breast"
          value={formData.name}
          name="name"
          onChange={handleChange}
          className="placeholder:opacity-100 focus:!border-t-gray-900"
          containerProps={{
            className: "!min-w-full",
          }}
          labelProps={{
            className: "hidden",
          }}
        />
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
            Calorie
          </Typography>
          <Input
            color="gray"
            size="lg"
            placeholder="eg. 165"
            name="calorie"
            value={formData.calorie}
            onChange={handleChange}
            type="number"
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
            
          />
        </div>
        <div className="w-full">
          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
            Protein
          </Typography>
          <Input
            color="gray"
            size="lg"
            placeholder="eg. 31"
            name="protein"
            type="number"
            value={formData.protein}
            onChange={handleChange}
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-full">
          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
            Carb
          </Typography>
          <Input
            color="gray"
            size="lg"
            placeholder="eg. 0"
            name="carb"
            type="number"
            value={formData.carb}
            onChange={handleChange}
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
          />
        </div>
        <div className="w-full">
          <Typography variant="small" color="blue-gray" className="mb-2 text-left font-medium">
            Fat
          </Typography>
          <Input
            color="gray"
            size="lg"
            placeholder="eg. 3.6"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            type="number"
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
          />
        </div>
      </div>
      </div>)
}
export default ModelForm;

