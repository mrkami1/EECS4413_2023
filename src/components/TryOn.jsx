import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem } from "@mui/material";

function Background({ children, face }) {
    return (
        <>
            <div style={{ width: 300, height: 300, display: "flex" }}>
                <img
                    src={face.src}
                    alt={face.alt}
                    loading="eager"
                    style={{
                        width: 300,
                        height: 300,
                        position: "absolute",
                    }}
                />
            </div>
            {children}
        </>
    );
}

function Glasses({ children, position, onMove }) {
    const [prevXY, setPrevXY] = useState(null);

    function handleHold(e) {
        e.preventDefault();
        e.target.setPointerCapture(e.pointerId);
        setPrevXY({ x: e.clientX, y: e.clientY });
    }

    function handleMove(e) {
        if (prevXY) {
            setPrevXY({ x: e.clientX, y: e.clientY });
            const dx = e.clientX - prevXY.x;
            const dy = e.clientY - prevXY.y;
            onMove(dx, dy);
        }
    }

    function handleUp() {
        setPrevXY(null);
    }

    return (
        <div
            onPointerDown={handleHold}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            style={{
                display: "flex",
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            {children}
        </div>
    );
}

export default function TryOn({ imgSrc, imgName }) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: -70, y: -140 });
    const faces = [
        {
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Ffemale.png?alt=media&token=9b0b2f5a-449e-48ab-8afe-b8712e70b36b",
            alt: "female",
        },
        {
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Fmale.png?alt=media&token=5ef5bab9-f8ae-4fb3-9e82-5383403a59da",
            alt: "male",
        },
    ];
    const [face, setFace] = useState(faces[0]);

    function handleMove(dx, dy) {
        setPosition({
            x: position.x + dx,
            y: position.y + dy,
        });
    }

    return (
        <div>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Try On
            </Button>
            <Dialog open={open} keepMounted>
                <DialogTitle>Virtual Try-on</DialogTitle>
                <DialogContent>
                    <Background face={face}>
                        <Glasses position={position} onMove={handleMove}>
                            <img src={imgSrc} alt={imgName} style={{ scale: "30%" }} />
                        </Glasses>
                    </Background>
                    <ImageList cols={2} rowHeight="auto" sx={{ display: "flex" }}>
                        {faces.map((face) => {
                            return (
                                <ImageListItem
                                    key={face.alt}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        justifyContent: "center",
                                        border: 3,
                                        borderColor: "white",
                                        ":hover": { borderColor: "cyan" },
                                    }}
                                >
                                    <img
                                        src={face.src}
                                        alt={face.alt}
                                        onClick={() => setFace(face)}
                                        loading="eager"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </ImageListItem>
                            );
                        })}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
