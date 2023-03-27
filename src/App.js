import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Main from "./pages/Main";
import Profile from "./pages/user/Profile";
import "./assets/styles.scss";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { UserFieldsProvider } from "./context/UserFieldsContext";

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
                            index
                            element={
                                <ProtectedRoute>
                                    <Main />
                                </ProtectedRoute>
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
                        <Route path="Login" element={<Login />} />
                        <Route path="Register" element={<Register />} />
                    </Route>
                </Routes>
            </BrowserRouter>
    );
}

export default App;
