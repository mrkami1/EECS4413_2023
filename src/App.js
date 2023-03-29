import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { Main } from "./pages/Main";
import Profile from "./pages/user/Profile";
// import "./index.css";
import { AllProducts } from "./pages/view/AllProducts";
import "./assets/styles.scss";
import { ProductDetail } from "./pages/view/ProductDetail";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserFieldsProvider } from "./context/UserFieldsContext";


function App() {
    const { currentUser } = useContext(AuthContext);

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/" />;
        }

        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={<Main />}
                    />
                    <Route 
                        path="user/Profile"
                        element={
                            <ProtectedRoute>
                                    <UserFieldsProvider>
                                        <Profile />
                                    </UserFieldsProvider>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="Login" element={<Login />} />
                    <Route path="Register" element={<Register />} />
                    <Route
                        path="/product-type/glasses"
                        element={<AllProducts type={'products'}/>}
                    />
                    <Route 
                        path="/product/:id"
                        element={<ProductDetail type={'products'}/>}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
