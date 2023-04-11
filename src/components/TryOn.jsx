import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem } from "@mui/material";
import { storage } from "../firebase";
import { deleteObject } from "firebase/storage";
import { getDownloadURL, 
         ref, 
         uploadBytes,
         listAll,
         } from "firebase/storage";
import { Slider } from '@mui/material';


function Background({ children, face}) {
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
    const defaultFaces = [
        {
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Ffemale.png?alt=media&token=16f1db32-a64f-49b6-8197-0da7ed6b3653",
            alt: "0",
        },
        {
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Fmale.png?alt=media&token=5ef5bab9-f8ae-4fb3-9e82-5383403a59da",
            alt: "1",
        },
    ];
    const [face, setFace] = useState(defaultFaces[0]);
    const [faces, setFaces] = useState(defaultFaces);
    const [uploadImg, setUploadImg] = useState(null);
    const [scale, setScale] = useState("0.3");
    const [value, setValue] = useState(50);


    const imagesListRef = ref(storage, "faces/");

    const uploadImage = () => { // upload image to firebase 
        if (uploadImg == null) return;
        const imageRef = ref(storage, `faces/${uploadImg.name}`);
        uploadBytes(imageRef, uploadImg).then((querySnapshot) => {         
            console.log("image uploaded")
            getDownloadURL(querySnapshot.ref).then((url) => {
                const newPic={
                    src: url, 
                    alt: (faces.length+1).toString()
                }
                setFaces((prev) => [...prev, newPic])
            })
        })
    }

    const deleteImage = () => { // delete image from firebase
        if (typeof(face.alt.name) === 'undefined') {
            setFace(defaultFaces[0])
            let deletedFaces = faces.filter(img => img !== face)
            setFaces(deletedFaces)
            const imageRef = ref(storage, face.src);
            deleteObject(imageRef).
                catch((error) => {
                    console.log("cannot delete", error)
                })
            alert("photo deleted !")
        }
        else if ( face.alt.name.includes("male.png") || face.alt.name.includes("female.png")) { // cannot delete default
                alert("cannot delete the default picture!")
                return
             }
             else {
                setFace(defaultFaces[0])
                let deletedFaces = faces.filter(img => img !== face)
                setFaces(deletedFaces)
                deleteObject(face.alt).
                    catch((error) => {
                        console.log("cannot delete", error)
                    })
                alert("deleted sucessfully!")
             }
    }


    useEffect(() => {
        const getImages = () => {
            const imageArray=[]
            listAll(imagesListRef).then((response) => {
                response.items.forEach((item) => {
                    getDownloadURL(item).then((url) => {
                        const img={
                            src: url,
                            alt: item
                        }
                        imageArray.push(img)
                        imageArray.sort((a,b) =>((a.alt > b.alt)? 1 : -1))
                    })
                })
                setFaces(imageArray)
            })
            .catch((error)=>{
                console.log(error.message)
            })
        }
        getImages();
    }, [])


    function handleMove(dx, dy) {
        setPosition({
            x: position.x + dx,
            y: position.y + dy,
        });
    }

    const handleSlider = (e) => {
        console.log(value)
        console.log(e.target.value)
        if (e.target.value > value ) {
            setScale((prev)=>(prev*1.05))
            setValue(e.target.value)
        }
        else {
            setScale((prev)=>(prev*0.95))
            setValue(e.target.value)
        }
    }


    return (
        <div>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                Try On
            </Button>
            <Dialog open={open} keepMounted style={{width: "450px", overflowX: "auto"}}>
                <DialogTitle>Virtual Try-on</DialogTitle>
                <DialogContent>  
                    <div className="face_background" style={{width: "100%", height: "300px"}}>
                    <Background face={face}>
                        <Glasses position={position} onMove={handleMove}>
                            <img src={imgSrc} alt={imgName} style={{ scale: `${scale}` }} />
                        </Glasses>
                    </Background>
                    </div>                  
                    <div className="imgList" style={{width: "100%", height: "120px"}}>
                    <ImageList cols={faces.length} rowHeight={100} sx={{ display: "flex", marginTop: "10px"}}>
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
                    </div>
    
                    <div className="image_buttons"  style={{width: "100%", height: "38px", marginTop: "10px"}}>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload_img"
                            onChange={(e)=>setUploadImg(e.target.files[0])}/>
                        <label htmlFor="upload_img">
                            <Button variant="contained" color="primary" component="span">
                                Select
                            </Button>
                        </label>
                        <Button variant="contained" color="primary" component="span" onClick={uploadImage} style={{marginLeft: "10px"}}>
                                Upload
                            </Button>
                            <Button variant="contained" color="primary" component="span" onClick={deleteImage} style={{marginLeft: "10px"}}>
                                Delete
                            </Button>
                    </div>
                    <div className="slider" style={{width: "100%", height: "30px", marginTop: "10px"}}>
                        <Slider
                                sx={{
                                        '& input[type="range"]': {
                                        WebkitAppearance: 'slider-horizontal',
                                        },
                                    }}
                                defaultValue={50}
                                aria-label="Glasses_Size"
                                valueLabelDisplay="auto"
                                onChange={handleSlider}
                            />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
