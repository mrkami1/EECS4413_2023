import { useContext } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import WebUsage from "./WebUsage";
import MonthlyReport from "./MonthlyReport";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";

// Yang
// for admin statistic components

export default function Administration() {
    const { userFields } = useContext(UserFieldsContext);
    const navigate = useNavigate();
    console.log("from admin:");
    console.log(userFields);
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <p>Welcome Administrator: {userFields?.name}</p>
            <button onClick={()=>navigate("/flyer")}>To Flyer edit page</button>
            <MonthlyReport />
            <hr />
            <WebUsage />
        </div>
    );
}
