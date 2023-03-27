import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { Main } from "./pages/Main";
import Profile from "./pages/user/Profile";
import { AddProducts } from "./pages/view/AddProducts";
import "./index.css";
// import "./assets/styles.scss";


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";


function App() {
    const { currentUser } = useContext(AuthContext);
    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route
                        path="Main"
                        element={<Main />}
                    />
                    <Route
                        path="/addproducts"
                        element={<AddProducts />}
                    />
                    <Route 
                        path="user/Profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="Login" element={<Login />} />
                    <Route path="Register" element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
