import React from "react";
import { ProfileCard } from "../user/Profile";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import WebUsage from "./WebUsage";
import MonthlyReport from "./MonthlyReport";

// Yang
// for admin statistic components

export default function Administration() {
    return (
        <div>
            <ProfileCard></ProfileCard>
            <Link>// to flyer edit page</Link>
            <MonthlyReport></MonthlyReport>
            <WebUsage></WebUsage>
        </div>
    );
}
