import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";

import Home from "../pages/Home/Home/Home";
import Shope from "../pages/HeroNavber/Shope/Shope";
import Dettels from "../pages/HeroNavber/Shope/Dettels";
import Checkout from "../pages/HeroNavber/Shope/Checkout";

import Servecing from "../pages/HeroNavber/Servecing/Servecing";
import Homeservice from "../pages/HeroNavber/Homeservice/Homeservice";

import LaptopPc from "../pages/HeroNavber/Homeservice/Homecard/LaptopPc";
import Glass from "../pages/HeroNavber/Homeservice/Homecard/Glass";
import Cctv from "../pages/HeroNavber/Homeservice/Homecard/Cctv";
import Electronic from "../pages/HeroNavber/Homeservice/Homecard/Electronic";

import AboutUs from "../pages/HeroNavber/About Us/AboutUs";
import Contact from "../pages/HeroNavber/Contact/Contact";
import ComplaintForm from "../pages/HeroNavber/ComplaintForm/ComplaintForm";
import Account from "../pages/Acount/Account";

import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import AddProduct from "../pages/Admin/AddProduct/AddProduct";
import AllProduct from "../pages/Admin/AllProduct/AllProduct";
import Orders from "../pages/Admin/Orders/Orders";
import Services from "../pages/Admin/Services/Services";
import Customers from "../pages/Admin/Customers/Customers";
import Payments from "../pages/Admin/Payments/Payments";
import Complaint from "../pages/Admin/Complaint/Complaint";

import PrivateRoute from "../PrivateRoute/PrivateRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,

        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "shope",
                Component: Shope,
            },
            {
                path: "shope/:id",
                Component: Dettels,
            },
            {
                path: "checkout/:id",
                Component: Checkout,
            },
            {
                path: "Servecing",
                Component: Servecing,
            },
            {
                path: "Homeservice",
                Component: Homeservice,
            },
            {
                path: "LaptopPc",
                Component: LaptopPc,
            },
            {
                path: "Cctv",
                Component: Cctv,
            },
            {
                path: "Electronic",
                Component: Electronic,
            },
            {
                path: "Glass",
                Component: Glass,
            },
            {
                path: "AboutUs",
                Component: AboutUs,
            },
            {
                path: "Contact",
                Component: Contact,
            },
            {
                path: "Account",
                Component: Account,
            },
            {
                path: "ComplaintForm",
                Component: ComplaintForm,
            },
        ],
    },

    {
        path: "/admin",
        children: [
            {
                path: "Dashboard",
                element: (
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "AllProduct",
                element: (
                    <PrivateRoute>
                        <AllProduct />
                    </PrivateRoute>
                ),
            },
            {
                path: "AddProduct",
                element: (
                    <PrivateRoute>
                        <AddProduct />
                    </PrivateRoute>
                ),
            },
            {
                path: "Orders",
                element: (
                    <PrivateRoute>
                        <Orders />
                    </PrivateRoute>
                ),
            },
            {
                path: "Services",
                element: (
                    <PrivateRoute>
                        <Services />
                    </PrivateRoute>
                ),
            },
            {
                path: "Customers",
                element: (
                    <PrivateRoute>
                        <Customers />
                    </PrivateRoute>
                ),
            },
            {
                path: "Payments",
                element: (
                    <PrivateRoute>
                        <Payments />
                    </PrivateRoute>
                ),
            },
            {
                path: "Complaint",
                element: (
                    <PrivateRoute>
                        <Complaint />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);
