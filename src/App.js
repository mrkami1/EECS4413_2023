import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { Main } from "./pages/Main";
import Profile from "./pages/user/Profile";
import OrderHistory from "./pages/user/OrderHistory";
import WishList from "./pages/user/WishList";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/view/Checkout";
import { AllProducts } from "./pages/view/AllProducts";
import "./assets/styles.scss";
import { ProductDetail } from "./pages/view/ProductDetail";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserFieldsProvider } from "./context/UserFieldsContext";
import { SearchPage } from "./pages/view/SearchPage";

import FlyersShow from "./pages/view/Flyer";
import Administration from "./pages/admin/Admin";

function App() {
    const { currentUser } = useContext(AuthContext);

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/" />;
        }

        return children;
    };

    return (
        <UserFieldsProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route
                            index
                            element={
                                <Main />
                            }
                        />
                        <Route 
                            path="user/Profile"
                            element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="user/OrderHistory"
                                element={
                                    <ProtectedRoute>
                                        <OrderHistory />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="user/WishList"
                                element={
                                    <ProtectedRoute>
                                        <WishList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="user/Cart"
                                element={
                                    <ProtectedRoute>
                                        <Cart />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="view/Checkout"
                                element={
                                    <ProtectedRoute>
                                        <Checkout />
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
                        <Route 
                            path="/search/:key"
                            element={<SearchPage type={'products'}/>}
                        />
                        <Route
                            path="admin/portal"
                            element={
                                <ProtectedRoute>
                                    <Administration />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="admin/flyer" element={<FlyersShow />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserFieldsProvider>
    );
}

export default App;
