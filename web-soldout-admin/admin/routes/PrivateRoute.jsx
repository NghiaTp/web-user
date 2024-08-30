import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { toast } from "react-toastify";


const PrivateRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(role)) {
        return toast.error('Nhân viên không thể truy cập vào đây')
    }

    return <Outlet />;
};

export default PrivateRoute;
