import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { getDocs, collection, doc, Timestamp } from "firebase/firestore"
// Yang
// get the sales of each month

function MonthSale({ report }) {
    return (
        <div>
            <p>2023 Month {report.mon} reached Order Total: {report.num}, Sales Total: {report.total}</p>
            <br />
        </div>
    );
}

function SalesReport() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const [reports, setReports] = useState(Array(month + 1));
    
    useEffect(() => {
        getDocs(collection(db, "orders")).then((shots) => {
            const reps = Array.from({ length: month + 1 }, (val, index) => ({ mon: index+1, num: 0, total: 0 }));
            shots.forEach((shot) => {
                const orders = shot.data().customerOrders;
                if(!orders) {return;}
                orders.forEach((order) => {
                    console.log(reps);
                    console.log(order);
                    const stamp = order.date.toDate();
                    if (stamp.getFullYear() === year){
                        let m = stamp.getMonth();
                        reps[m].num += 1;
                        reps[m].total += order.total;
                    }
                })
            })
            setReports(reps);
        })
    }, []);


    return (
        <div>
            {reports.slice().reverse().map((report, index) => <MonthSale key={index} report={report} />)}
        </div>
    );
}

export default function MonthlyReport() {
    return (
        <div>
            <h2>2023 Monthly Sales Report</h2>
            <SalesReport />
        </div>
    );
}
