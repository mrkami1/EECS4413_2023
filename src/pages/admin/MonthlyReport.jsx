import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Card,
    Box,
    CardHeader,
    CardContent,
    TableBody,
} from "@mui/material";

// Yang
// get the sales of each month
function SalesReport() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const [reports, setReports] = useState(Array(month + 1));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        getDocs(collection(db, "orders")).then((shots) => {
            const reps = Array.from({ length: month + 1 }, (val, index) => ({ mon: index, num: 0, total: 0 }));
            shots.forEach((shot) => {
                const orders = shot.data().customerOrders;
                if (!orders) {
                    return;
                }
                orders.forEach((order) => {
                    console.log(reps);
                    console.log(order);
                    const stamp = order.date.toDate();
                    if (stamp.getFullYear() === year) {
                        let m = stamp.getMonth();
                        reps[m].num += 1;
                        reps[m].total += Number(order.total);
                    }
                });
            });
            setReports(reps);
        });
    }, []);

    return (
        <TableContainer sx={{ float: "right" }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Month</TableCell>
                        <TableCell align="right">Total Orders</TableCell>
                        <TableCell align="right">Total Sales (CAD)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reports
                        .slice()
                        .reverse()
                        .map((report, index) => (
                            <TableRow key={index} report={report}>
                                <TableCell align="center">{months[report.mon]}</TableCell>
                                <TableCell align="right">{report.num}</TableCell>
                                <TableCell align="right">{report.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function MonthlyReport() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Card sx={{ width: 800 }}>
                <CardHeader title="2023 Monthly Sales Report"></CardHeader>
                <CardContent>
                    <SalesReport />
                </CardContent>
            </Card>
        </Box>
    );
}
