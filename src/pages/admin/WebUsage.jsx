import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Card, CardContent, CardHeader, List, ListItem, ListItemText } from "@mui/material";

// Yang
// keep track of all the users who log in our system and display
export default function WebUsage() {
    const [users, setUsers] = useState([]);
    // console.log(users);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && !users.some((u) => u.id === user.uid)) {
                setUsers([
                    ...users,
                    {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                    },
                ]);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Card sx={{ width: 800 }}>
                <CardHeader title="Web usage" subheader={"Logged-in users: " + users.length}></CardHeader>
                <CardContent>
                    <List>
                        {users.map((u) => (
                            <ListItem key={u.id}>
                                <ListItemText primary={u.name} secondary={u.email}></ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
}
