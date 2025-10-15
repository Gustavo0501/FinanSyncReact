import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = ({ children }) => {
return (
<>
{children}
<ToastContainer position="top-right" autoClose={4000} hideProgressBar />
</>
);
};

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);

export default ToastProvider;