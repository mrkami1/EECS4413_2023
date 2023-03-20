import React from "react";
import { ProfileCard } from "./Profile";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

// for admin statistic components

function MonthlyReport() {}

function WebUsage() {}

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
