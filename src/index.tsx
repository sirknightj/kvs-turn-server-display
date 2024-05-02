import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login/Login';
import {createHashRouter, RouterProvider} from "react-router-dom";
import {ThemeProvider} from "@mui/material";
import {ToastContainer} from "react-toastify";
import theme from "./Utils/Theme";
import TurnServerViewer from "./TurnServerViewer/TurnServerViewer";
import 'react-toastify/dist/ReactToastify.css';

const router = createHashRouter([
    {
        path: "/",
        element: <Login/>,
    },
    {
        path: "/turn",
        element: <TurnServerViewer/>
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ThemeProvider theme={theme}>
        <RouterProvider router={router}/>
        <ToastContainer/>
    </ThemeProvider>
);
