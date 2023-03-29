import React, { useContext } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import WebUsage from "./WebUsage";
import MonthlyReport from "./MonthlyReport";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Yang
// for admin statistic components

export default function Administration() {
    const { admin } = useContext(AuthContext);
    return (
        <div>
            <Navbar />
            <p>Welcome Administrator: {admin.displayName}</p>
            <Link to="/admin/flyer">To Flyer edit page</Link>
            <MonthlyReport />
            <hr />
            <WebUsage />
        </div>
    );
}
