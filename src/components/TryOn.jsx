import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ImageList, ImageListItem } from "@mui/material";
import { storage } from "../firebase";
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
            src: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Ffemale.png?alt=media&token=9b0b2f5a-449e-48ab-8afe-b8712e70b36b",
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


    useEffect(() => {
        const getImages = () => {
            const imageArray=[]
            listAll(imagesListRef).then((response) => {
                response.items.forEach((item) => {
                    // console.log("item info: "+item)
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
            <Dialog open={open} keepMounted style={{maxWidth: "450px", overflowX: "auto"}}>
                <DialogTitle>Virtual Try-on</DialogTitle>
                <DialogContent>                    
                    <Background face={face}>
                        <Glasses position={position} onMove={handleMove}>
                            <img src={imgSrc} alt={imgName} style={{ scale: `${scale}` }} />
                        </Glasses>
                    </Background>
                    <ImageList cols={faces.length} rowHeight="auto" sx={{ display: "flex", marginTop: "-150px"}}>
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
                    <div>
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
                        <Button variant="contained" color="primary" component="span" onClick={uploadImage} style={{marginLeft: "2px"}}>
                                Upload
                            </Button>
                            {/* <Button variant="contained" color="primary" component="span" style={{marginLeft: "2px"}} onClick={() => setScale((prev)=>(prev*1.1))}>+</Button>
                            <Button variant="contained" color="primary" component="span" style={{marginLeft: "2px"}} onClick={() => setScale((prev)=>(prev*0.9))}>-</Button> */}
                    </div>
                    <Slider
  sx={{
    '& input[type="range"]': {
      WebkitAppearance: 'slider-horizontal',
    },
  }}
//   orientation="vertical"
  defaultValue={50}
  aria-label="Glasses_Size"
  valueLabelDisplay="auto"
//   step={0.1}
  onChange={handleSlider}
/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
