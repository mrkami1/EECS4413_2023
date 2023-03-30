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
                        element={
                            <UserFieldsProvider>
                                <Main />
                            </UserFieldsProvider>
                        }
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
                        <Route
                            path="user/OrderHistory"
                            element={
                                <ProtectedRoute>
                                    <UserFieldsProvider>
                                        <OrderHistory />
                                    </UserFieldsProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="user/WishList"
                            element={
                                <ProtectedRoute>
                                    <UserFieldsProvider>
                                        <WishList />
                                    </UserFieldsProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="user/Cart"
                            element={
                                <ProtectedRoute>
                                    <UserFieldsProvider>
                                        <Cart />
                                    </UserFieldsProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="view/Checkout"
                            element={
                                <ProtectedRoute>
                                    <UserFieldsProvider>
                                        <Checkout />
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
                    <Route 
                        path="/search/:key"
                        element={<SearchPage type={'products'}/>}
                    />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;

