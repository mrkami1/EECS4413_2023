import { useState } from "react";
import { db, auth } from "../../firebase";
// Yang
// get the sales of each month

function TimeSelector() {
    return <div></div>;
}

function MonthSale({ data }) {
    return <div></div>;
}

function SalesReport() {
    const [reports, setReports] = useState([]);
    return (
        <div>
            {reports.map((report) => {
                return <MonthSale key={report.month} data={report} />;
            })}
        </div>
    );
}

export default function MonthlyReport() {
    return (
        <div>
            <h1>Monthly Sales Report</h1>
            <TimeSelector />
            <SalesReport />
        </div>
    );
}
