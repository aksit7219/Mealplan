import { setOpenConfigurator, useMaterialTailwindController } from "@/context";
import { AddMenu, Customer, Delivery, Home, Inventory, Recipe, Profile, SalesNmarket } from "@/pages";
import {
  Cog6ToothIcon,
  HomeIcon,
  QueueListIcon,
  RectangleStackIcon,
  ServerStackIcon,
  UserCircleIcon,
  InformationCircleIcon,
  UserGroupIcon
} from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import { Suspense } from "react";
import { Outlet, Route, Router, Routes } from "react-router-dom";
import MealPlan from "./pages/mealplan";
import { Configurator, DashboardNavbar, Footer, Loader, Sidenav } from "./widgets/layout";
import Items from "./pages/items";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const icon = { className: "w-5 h-5 text-inherit", };

  const pages = [
    { icon: <HomeIcon {...icon} />, name: "home", path: "/", },
    // { icon: <HomeIcon {...icon} />, name: "addmenu", path: "/addmenu", },
    { icon: <QueueListIcon {...icon} />, name: "Meal Plans", path: "/mealplans", },
    { icon: <UserGroupIcon {...icon} />, name: "customers", path: "/customers", },
    { icon: <RectangleStackIcon {...icon} />, name: "Recipe", path: "/recipe", },
    { icon: <RectangleStackIcon {...icon} />, name: "Items", path: "/items", },
    { icon: <RectangleStackIcon {...icon} />, name: "inventory", path: "/inventory", },
    { icon: <RectangleStackIcon {...icon} />, name: "delivery", path: "/delivery", },
  ]
  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        pages={pages}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Outlet />
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/dashboard.jsx";

export default Dashboard;