import React, { useState, lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader } from "./widgets/layout";
import IsAuth from "./customHooks/isAuth";
import MealPlanSingle from './pages/mealplanSingle';
import MealPlanNew from './pages/mealPalanNew';
import Test from './pages/test';
import BundleSingle from './pages/mealPlanBundlesSingle';

import MealPlanBundle from './pages/mealPlanBundles';
import CustomerSingle from './pages/customerSingle';
import DeliveryDriver from './widgets/deliveryPages/deliveryDriver';
import DeliveryTable from './widgets/deliveryPages/deliveryTable';
import TimeDelivery from './widgets/deliveryPages/timeDelivery';
import DeliveryZone from './widgets/deliveryPages/deliveryZone';
import DeliveryVehicle from './widgets/deliveryPages/deliveryVehicle';
import Menu from './pages/menu';
import MenuItems from './pages/menuItems';


const Dashboard = lazy(() => import("./dashboard"));
const SignIn = lazy(() => import("./pages/sign-in"));
const Signup = lazy(() => import("./pages/sign-up"));
const MealPlan = lazy(() => import("@/pages/mealplan"));
const AddMenu = lazy(() => import("@/pages/addMenu"));
const Customer = lazy(() => import("@/pages/customer"));
const Delivery = lazy(() => import("@/pages/delivery"));
const Home = lazy(() => import("@/pages/home"));
const Inventory = lazy(() => import("@/pages/inventory"));
const Profile = lazy(() => import("@/pages/profile"));
const Recipe = lazy(() => import("@/pages/recipe"));
const SalesNmarket = lazy(() => import("@/pages/salesNmarket"));
const Items = lazy(() => import("./pages/items"));

export const AuthContext = React.createContext(null);

function App() {
  const [isAuthenticated, setisauthenticated] = useState(false);
  const location = useLocation();

  const PrivateRoute = ({ ele }) => {
    console.log(isAuthenticated)
    return isAuthenticated ? ele : <Navigate to="/sign-in" state={{ from: location }} />
  };

  return (
    <>
      <IsAuth setisauthenticated={setisauthenticated} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<PrivateRoute ele={<Dashboard />} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/addmenu" element={<AddMenu />} />
            <Route path="/mealplans" element={<MealPlanNew />} />
            <Route path="/mealplans/:id" element={<MealPlanSingle />} />
            <Route path="/mealplans/:id/:SingleBundleId" element={<BundleSingle />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/customers/:CustomerId" element={<CustomerSingle />} />
            <Route path="/bundles" element={<MealPlanBundle all={true} />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/manage/:MenuId" element={<MenuItems />} />
            {/* <Route path="/recipe" element={<Recipe />} /> */}
            <Route path="/recipe/:type" element={<Recipe />} />
            <Route path="/items" element={<Items />} />
            <Route path="/inventory" element={<Inventory />} />

            <Route path="/delivery" element={<Delivery />} />

            <Route path="/delivery/DeliveryTable" element={<DeliveryTable />} />
            <Route path="/delivery/TimeDelivery" element={<TimeDelivery />} />
            <Route path="/delivery/Vehicles" element={<DeliveryVehicle />} />
            <Route path="/delivery/Zones" element={<DeliveryZone />} />
            <Route path="/delivery/Drivers" element={<DeliveryDriver />} />

            <Route path="/salesnmarket" element={<SalesNmarket />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-in/restaurants" element={<SignIn />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/restaurants" element={<Signup />} />
          <Route path="/admin" element={<SignIn />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
