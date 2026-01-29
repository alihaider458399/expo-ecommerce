import React from 'react'

import {SignedIn, SignedOut, SignInButton, useAuth, UserButton} from '@clerk/clerk-react';
import {Routes, Route, Navigate} from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";

const App = () => {
    const {isSignedIn, isLoaded} = useAuth();
    if (!isLoaded) return null;
    return (
        <Routes>
            <Route path="/login" element={isSignedIn ? <Navigate to={"/dashboard"}/> : <LoginPage/>}/>

            {/*    nested routes*/}
            <Route path="/" element={isSignedIn ? <DashboardLayout/> : <LoginPage/>}>

                <Route index element={<Navigate to={"dashboard"}/>}/>
                <Route path="dashboard" element={<DashboardPage/>}/>
                <Route path="products" element={<ProductsPage/>}/>
            </Route>
        </Routes>
    )
}
export default App
