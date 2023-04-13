import { useState, useEffect, useRef, useContext } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem } from "@mui/material";
import { storage } from "../firebase";
import { db } from "../firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject } from "firebase/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Slider } from "@mui/material";
import UserFieldsContext from "../context/UserFieldsContext";
import { useNavigate } from "react-router-dom";

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
                transform: `translate(${position.x}px, ${position.y}px)`,
                display: "inline-block",
            }}
        >
            {children}
        </div>
    );
}

export default function TryOn({ imgSrc, imgName }) {
    const { userFields } = useContext(UserFieldsContext);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: 85, y: -140 });
    const glassRef = useRef();
    const [width, setWidth] = useState(130);
    const defaultFaces = [
        {
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Ffemale.png?alt=media&token=fdcb0eed-1195-4461-9637-b786cc234470",
            alt: "female",
            del: false,
        },
        {
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Fmale.png?alt=media&token=5ef5bab9-f8ae-4fb3-9e82-5383403a59da",
            alt: "male",
            del: false,
        },
    ];
    const [face, setFace] = useState(defaultFaces[0]);
    const [faces, setFaces] = useState(defaultFaces);
    const navigate = useNavigate();

    useEffect(() => {
        const imageArray = [...defaultFaces];
        if (userFields?.selfies.length) {
            imageArray.push(...userFields.selfies);
            setFaces(imageArray);
        }
    }, []);

    const uploadImage = (e) => {
        // upload image to firebase
        if (!userFields) {
            navigate("/login");
            return;
        }
        const uploadImg = e.target.files[0];
        const imageRef = ref(storage, `faces/${uploadImg.name}`);
        uploadBytes(imageRef, uploadImg).then((querySnapshot) => {
            console.log("image uploaded");
            getDownloadURL(querySnapshot.ref).then((url) => {
                const newPic = {
                    src: url,
                    alt: uploadImg.name,
                    del: true,
                };
                setFaces((prev) => [...prev, newPic]);
                const userRef = doc(db, "users", userFields?.userID);
                getDoc(userRef).then((userSnap) => {
                    if (userSnap.exists()) {
                        const selfieArr = userSnap.data().selfies;
                        if (selfieArr) {
                            updateDoc(userRef, { selfies: [...selfieArr, newPic] });
                        } else {
                            updateDoc(userRef, { selfies: [newPic] });
                        }
                    }
                });
            });
        });
    };

    const deleteImage = () => {
        // delete image from firebase
        const userRef = doc(db, "users", userFields?.userID);
        getDoc(userRef).then((userSnap) => {
            if (userSnap.exists()) {
                const selfieArr = userSnap.data().selfies;
                updateDoc(userRef, { selfies: selfieArr.filter((s) => s.alt !== face.alt) });
                deleteObject(ref(storage, face.src)).catch((error) => {
                    console.log(error);
                });
                alert("photo deleted!");
            }
        });
        setFaces(faces.filter((f) => f.alt !== face.alt));
        setFace(defaultFaces[0]);
    };

    function handleMove(dx, dy) {
        const height = glassRef.current.clientHeight;
        setPosition({
            x: Math.max(0, Math.min(position.x + dx, 300 - width)),
            y: Math.max(-300, Math.min(position.y + dy, 0 - height)),
        });
    }

    const handleSlider = (e) => {
        setWidth((e.target.value - 50) * 5 + 130);
    };

    return (
        <div>
            <Button variant="outlined" onClick={() => setOpen(true)} sx={{ ml: 2 }}>
                Try On
            </Button>
            <Dialog
                open={open}
                keepMounted
                style={{ width: 600, overflowX: "auto", position: "fixed", top: 30, left: "30%" }}
            >
                <DialogTitle>Virtual Try-on</DialogTitle>
                <DialogContent>
                    <div className="face_background" style={{ width: "100%", height: "300px" }}>
                        <Background face={face}>
                            <Glasses position={position} onMove={handleMove}>
                                <img src={imgSrc} alt={imgName} ref={glassRef} width={width} />
                            </Glasses>
                        </Background>
                    </div>
                    <div className="imgList" style={{ width: "100%", height: "120px" }}>
                        <ImageList cols={faces.length} rowHeight={100} sx={{ display: "flex", marginTop: "10px" }}>
                            {faces.map((f) => (
                                <ImageListItem
                                    key={f.alt}
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
                                        src={f.src}
                                        alt={f.alt}
                                        onClick={() => setFace(f)}
                                        loading="eager"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </div>
                    <div
                        className="image_buttons"
                        style={{
                            width: "100%",
                            height: "38px",
                            marginTop: "10px",
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            id="upload_img"
                            onChange={uploadImage}
                        />
                        <label htmlFor="upload_img">
                            <Button variant="contained" color="primary" component="span">
                                Upload your image
                            </Button>
                        </label>
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            disabled={!face.del}
                            onClick={deleteImage}
                        >
                            Delete
                        </Button>
                    </div>
                    <div className="slider" style={{ width: "100%", height: "30px", marginTop: "10px" }}>
                        <Slider defaultValue={50} min={30} max={84} aria-label="Glasses_Size" onChange={handleSlider} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
