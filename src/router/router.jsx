import { createBrowserRouter } from "react-router";
import Layout from "../pages/Layout";
import BoardList from "../pages/board/BoardList";
import LoginForm from "../pages/login/LoginForm";
import ProtectedRoute from "../compoents/ProtectedRoute";

export const router = createBrowserRouter([
   {
        path: '/',
        Component: Layout,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <BoardList />
                    </ProtectedRoute>
                )
            },
            {
                path: 'board',
                children: [
                    {
                        index: true,
                        element: (
                            <ProtectedRoute>
                                <BoardList />
                            </ProtectedRoute>
                        )
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        Component: LoginForm
    }
]);
