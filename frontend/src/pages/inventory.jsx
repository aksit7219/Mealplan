import api from '@/config';
import ModelForm from '@/widgets/forms/modelForm';
import { Loader } from '@/widgets/layout';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Card, IconButton, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from 'react';

export const Inventory = () => {
  // Access the client
  const queryClient = useQueryClient()
  const [RawIngredients, setRawIngredients] = useState([])
  const [SelectedRawIngredients, setSelectedRawIngredients] = useState({})
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    calorie: '',
    protein: '',
    carb: '',
    fat: ''
  })

  // Fetching all recipes using useQuery
  const { data, isFetching, error } = useQuery({
    queryKey: ['raw-ingredients'],
    queryFn: async () => {
      const response = await api.get("/raw-ingredients");
      setRawIngredients(response.data);
      return response.data;
    }
  })

   // Mutation for creating or updating recipes
   const mutation = useMutation(
    {
      mutationFn: async (formData) => {
        if (SelectedRawIngredients._id) {
          return await api.put("/raw-ingredients/" + SelectedRawIngredients._id, formData);
        } else {
          return await api.post("/raw-ingredients/", formData);
        }
      },
      onSuccess: () => {
        // Invalidate and refetch recipes
        queryClient.invalidateQueries(['raw-ingredients']);
        setOpen(false);  // Close the form after successful submission
        setSelectedRawIngredients({});
        setFormData({
          name: '',
          calorie: '',
          protein: '',
          carb: '',
          fat: ''
        });
      },
    }
  );

  const handleEditIngredient = (value) => {
    setOpen(true)
    setSelectedRawIngredients(value)
    setFormData({
      name: value.name || '',
      calorie: value.calorie || '',
      protein: value.protein || '',
      carb: value.carb || '',
      fat: value.fat || ''
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSave = () => {
    mutation.mutate(formData);
  }

  return (
    <>
    <div className="mt-32 mb-8 flex-row gap-12">
      <div className="flex flex-wrap items-stretch">
        <Card className="h-[75vh] w-full">
          <div className="flex flex-col h-full w">
            <div className="flex-grow overflow-auto">
              <table className="relative w-full text-center rounded-[5rem]">
                <thead>
                  <tr>
                    <th className="sticky top-0 border-b  rounded-tl-[.5rem] border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none opacity-70"
                      >
                        Name
                      </Typography>
                    </th>
                    <th className="sticky top-0 border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none opacity-70"
                      >
                        Calories
                      </Typography>
                    </th>
                    <th className="sticky top-0 border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none opacity-70"
                      >
                        Protein
                      </Typography>
                    </th>
                    <th className="sticky top-0 border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none opacity-70"
                      >
                        Carbs
                      </Typography>
                    </th>
                    <th className="sticky top-0 border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium leading-none opacity-70"
                      >
                        Fat
                      </Typography>
                    </th>
                    <th className="sticky top-0 border-b rounded-tr-[.5rem] border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium  leading-none opacity-70"
                      >
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {isFetching ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                       <Loader height='50' width='50'/>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-red-500">
                        Error loading data. Please try again.
                      </td>
                    </tr>
                  ) : (
                    RawIngredients.map((value, index) => (
                      <tr key={index} className="even:bg-blue-gray-50/50 hover:bg-green-100">
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {value.name}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {value.calorie}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {value.protein}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {value.carb}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {value.fat}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            onClick={() => handleEditIngredient(value)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
      
      <Dialog open={open} handler={() => setOpen(false)}>
        <DialogBody>
          <ModelForm
            formData={formData}
            handleChange={handleChange}
            handleSave={handleSave}
            title="Raw Ingredient Details"
            submitButtonText="Save"
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
            Cancel
          </Button>
          <Button variant="gradient" color="green" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
    </>
  )
}

export default Inventory