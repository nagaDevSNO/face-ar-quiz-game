const video = document.getElementById("video");

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
    video.srcObject = stream;
});

// Initialize FaceMesh
const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
    }
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Detect face movement
faceMesh.onResults(results => {
    if (results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Nose position (important point)
        const nose = landmarks[1];

        const x = nose.x;

        // Detect left / right movement
        if (x < 0.4) {
            console.log("LEFT");
        } else if (x > 0.6) {
            console.log("RIGHT");
        } else {
            console.log("CENTER");
        }
    }
});

// Connect camera to face mesh
const camera = new Camera(video, {
    onFrame: async () => {
        await faceMesh.send({ image: video });
    },
    width: 640,
    height: 480
});

camera.start();