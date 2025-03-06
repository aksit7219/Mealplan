import { setOpenSidenav, useMaterialTailwindController } from "@/context";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  InboxIcon,
  PresentationChartBarIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography
} from "@material-tailwind/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    title: "Meal Plans",
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    items: [
      { label: "All Plans", link: "/mealplans" },
      { label: "Calorie Ranges", link: "/recipe/Recipe" },
      { label: "Plan Bundles", link: "/bundles" },
      { label: "Sizes", link: "/recipe/Recipe" }
    ]
  },
  {
    id: 2,
    title: "Recipe",
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    items: [
      { label: "Recipe", link: "/recipe/Recipe" },
      { label: "Meal", link: "/recipe/Meal" },
      { label: "Sub-recipe", link: "/recipe/Sub-recipe" },
      { label: "Sauce", link: "/recipe/Sauce" },
      { label: "Snacks", link: "/recipe/Snack" },
      { label: "Sides", link: "/recipe/Side" },
      { label: "Drinks", link: "/recipe/Drink" }
    ]
  },
  {
    id: 3,
    title: "Delivery",
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    items: [
      { label: "Delivery Table", link: "/delivery/DeliveryTable" },
      { label: "Time Delivery", link: "/delivery/TimeDelivery" },
      { label: "Vehicles", link: "/delivery/Vehicles" },
      { label: "Zones", link: "/delivery/Zones" },
      { label: "Drivers", link: "/delivery/Drivers" }
    ]
  },
  {
    id: 4,
    title: "Menu",
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    items: [{ label: "All Menus", link: "/menu" }]
  },
  {
    id: 5,
    title: "Kitchen",
    icon: <PresentationChartBarIcon className="h-5 w-5" />,
    items: [
      { label: "Production", link: "/kitchen/production" },
      { label: "Packing", link: "/kitchen/packing" },
      { label: "Delivery", link: "/kitchen/production" }
    ]
  }
];

function CategoryAccordion({ category, open, handleOpen }) {
 

  return (
    <>
   
    <Accordion
      open={open === category.id}
      icon={
        <ChevronDownIcon
          strokeWidth={2.5}
          className={`mx-auto h-4 w-4 transition-transform ${open === category.id ? "rotate-180" : ""}`}
        />
      }
    >
      <ListItem className="p-0" selected={open === category.id}>
        <AccordionHeader onClick={() => handleOpen(category.id)} className="border-b-0 p-3">
          <ListItemPrefix>
            {category.icon}
          </ListItemPrefix>
          <Typography color="blue-gray" className="mr-auto font-normal">
            {category.title}
          </Typography>
        </AccordionHeader>
      </ListItem>
      <AccordionBody className="py-1 px-7">
        <List className="p-0">
          {category.items.map((item, index) => (
            <Link to={item.link} key={index}>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                {item.label}
              </ListItem>
            </Link>
          ))}
        </List>
      </AccordionBody>
    </Accordion>
    </>
  );
}

export function Sidenav() {
  const [controller,dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [open, setOpen] = useState(0);


  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${openSidenav ? "translate-x-0" : "-translate-x-80"} 
        fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="flex flex-row justify-between items-center mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Meal Plan
        </Typography>
        <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <XMarkIcon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
      </div>
     
      <List>

      {/* <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <XMarkIcon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton> */}
     
        <Link to="/">
          <ListItem>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5" />
            </ListItemPrefix>
            Home
          </ListItem>
        </Link>
        {categories.map((category) => (
          <CategoryAccordion
            key={category.id}
            category={category}
            open={open}
            handleOpen={handleOpen}
          />
        ))}
        <Link to="/customers">
          <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Customers
          </ListItem>
        </Link>
      </List>
    </aside>
  );
}

export default Sidenav;
