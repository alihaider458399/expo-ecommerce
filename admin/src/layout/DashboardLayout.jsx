import React from 'react'
import {Outlet} from "react-router";

const DashboardLayout = () => {
    return (
        <div>
            navbar
            sidebar
            <Outlet />
        </div>
    )
}
export default DashboardLayout
