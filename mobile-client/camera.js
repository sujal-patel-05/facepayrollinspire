// Camera utility functions for mobile face capture

/**
 * Initialize camera with optimal settings for face capture
 */
async function initializeCamera(videoElement) {
    try {
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;

        return stream;
    } catch (error) {
        console.error('Camera initialization failed:', error);
        throw new Error('Unable to access camera. Please check permissions.');
    }
}

/**
 * Capture image from video stream
 */
function captureImage(videoElement, quality = 0.8) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to base64 JPEG
    return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Stop camera stream
 */
function stopCameraStream(stream) {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

/**
 * Compress image to reduce upload size
 */
function compressImage(base64Image, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = base64Image;
    });
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCamera,
        captureImage,
        stopCameraStream,
        compressImage
    };
}
