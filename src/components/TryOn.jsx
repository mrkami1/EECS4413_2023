import { useState } from "react";

function Background({ position }) {
    return (
        <div
            style={{
                position: "absolute",
                // transform: `translate(${position.x}px, ${position.y}px)`,
                width: 200,
                height: 200,
            }}
        />
    );
}

function Glasses({ children, position, onMove }) {
    const [prevXY, setPrevXY] = useState(null);

    function handleHold(e) {
        e.target.setPointerCapture(e.pointerId);
        setPrevXY({ x: e.clientX, y: e.clientY });
    }

    function handleMove(e) {
        if (prevXY) {
            setPrevXY({ x: e.clientX, y: e.clientY });
        }
        const dx = e.clientX - prevXY.x;
        const dy = e.clientY - prevXY.y;
        onMove(dx, dy);
    }

    return (
        <div
            onPointerDown={handleHold}
            onPointerMove={handleM}
            onPointerUp={() => setPrevXY(null)}
            style={{
                width: 100,
                height: 20,
                position: "absolute",
                display: "flex",
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            {children}
        </div>
    );
}

export default function TryOn({ imgSrc, imgName }) {
    const faces = {
        female: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Ffemale.png?alt=media&token=9b0b2f5a-449e-48ab-8afe-b8712e70b36b",
        male: "https://firebasestorage.googleapis.com/v0/b/project-6e0fc.appspot.com/o/faces%2Fmale.png?alt=media&token=5ef5bab9-f8ae-4fb3-9e82-5383403a59da",
    };
    const [glasses, setGlasses] = useState({ width: 100, position: { x: 50, y: 50 } });
    const [face, setFace] = useState(faces.female);

    function handleMove(dx, dy) {
        setGlasses({
            ...glasses,
            position: {
                x: glasses.position.x + dx,
                y: glasses.position.y + dy,
            },
        });
    }

    return (
        <>
            <Background />
            <Glasses position={glasses.position} onMove={handleMove}>
                <img src={imgSrc} alt={imgName} />
            </Glasses>
            <div>
                <img src={faces.female} alt="female" onClick={() => changeFace(faces.female)} />
                <img src={faces.male} alt="male" onClick={() => changeFace(faces.male)} />
            </div>
        </>
    );
}
