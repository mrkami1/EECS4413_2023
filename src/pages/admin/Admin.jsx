import { useContext } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import WebUsage from "./WebUsage";
import MonthlyReport from "./MonthlyReport";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";
import { Paper, Typography, Button } from "@mui/material";

// Yang
// for admin statistic components

export default function Administration() {
    const { userFields } = useContext(UserFieldsContext);
    const navigate = useNavigate();
    console.log("from admin:");
    console.log(userFields);
    return (
        <>
            <Navbar />
            <Paper elevation={2} sx={{ margin: 2, padding: 2 }}>
                <Typography variant="h5">Welcome Administrator: {userFields?.name}</Typography>
                <Button variant="outlined" onClick={() => navigate("/flyer")}>
                    To Flyer edit page
                </Button>
                <MonthlyReport />
                <WebUsage />
            </Paper>
        </>
    );
}
