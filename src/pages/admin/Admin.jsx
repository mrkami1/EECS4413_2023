import { useContext } from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import WebUsage from "./WebUsage";
import MonthlyReport from "./MonthlyReport";
import UserFieldsContext from "../../context/UserFieldsContext";

// Yang
// for admin statistic components

export default function Administration() {
    const { userFields } = useContext(UserFieldsContext);
    console.log("from admin:");
    console.log(userFields);
    return (
        <div>
            <div>
                <Navbar />
            </div>
            {/* <p>Welcome Administrator: {userFields.name}</p> */}
            <Link to="flyer" target="_blank">
                To Flyer edit page
            </Link>
            <MonthlyReport />
            <hr />
            <WebUsage />
        </div>
    );
}
