import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ScanAttendance.css';

// We use the same base URL approach as the rest of the app
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ScanAttendance = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();

    const [status, setStatus] = useState('scanning'); // scanning, detected, verifying, success, error
    const [successData, setSuccessData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isScanning, setIsScanning] = useState(true);

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            setIsScanning(true);
            scanLoop();
        } catch (err) {
            console.error("Camera Error: ", err);
            setStatus('error');
            setErrorMsg("Camera access denied or not available. Please allow camera permissions.");
            setIsScanning(false);
        }
    };

    const stopCamera = () => {
        setIsScanning(false);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
    };

    const scanLoop = async () => {
        if (!isScanning) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.paused) {
            setTimeout(scanLoop, 500);
            return;
        }

        setStatus('verifying');

        try {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);
            const imageBase64 = canvas.toDataURL('image/jpeg', 0.6);

            const res = await axios.post(`${API_URL}/attendance/check-in`, {
                face_image: imageBase64
            }, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (res.data && res.data.recognized) {
                setStatus('success');
                setSuccessData(res.data);
                setIsScanning(false);
                setTimeout(() => resetApp(), 4000); // Auto reset after success
                return; // Stop loop
            } else {
                setStatus('scanning');
            }
        } catch (err) {
            setStatus('scanning');
        }

        if (isScanning) {
            setTimeout(scanLoop, 1500);
        }
    };

    const resetApp = () => {
        setSuccessData(null);
        setErrorMsg('');
        setStatus('scanning');
        setIsScanning(true);
        scanLoop();
    };

    return (
        <div className="scan-container">
            <div className="camera-wrapper">
                <video ref={videoRef} playsInline muted autoPlay></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                <div className="camera-overlay">
                    <header className="scan-header">
                        <div className="brand">
                            <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>FaceAI</span>
                        </div>
                        <div className="time-display">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </header>

                    <div className={`scan-orbital ${status === 'verifying' ? 'detected' : ''}`}></div>

                    <div className="scan-footer">
                        <div className="status-pill">
                            <div className={`status-dot ${status}`}></div>
                            <span>
                                {status === 'scanning' && 'Scanning for face...'}
                                {status === 'verifying' && 'Verifying identity...'}
                                {status === 'success' && 'Access Granted!'}
                                {status === 'error' && 'Error'}
                            </span>
                        </div>
                        <Link to="/register-face" style={{ color: 'white', opacity: 0.8, fontSize: '0.9rem' }}>
                            New Employee? Register Here
                        </Link>
                    </div>
                </div>
            </div>

            {status === 'success' && successData && (
                <div className="overlay-fullscreen">
                    <div className="success-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2>Welcome Back!</h2>
                    <h1 style={{ color: '#10b981', margin: '10px 0' }}>{successData.employee_name}</h1>
                    <p>Attendance logged at {new Date().toLocaleTimeString()}</p>
                </div>
            )}

            {status === 'error' && (
                <div className="overlay-fullscreen">
                    <div className="success-icon" style={{ backgroundColor: '#ef4444' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>
                    <h2>Check-in Failed</h2>
                    <p style={{ marginBottom: '20px' }}>{errorMsg}</p>
                    <button className="btn" onClick={resetApp}>Try Again</button>
                    <button className="btn" onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.2)', marginLeft: '10px' }}>Go to Dashboard</button>
                </div>
            )}
        </div>
    );
};

export default ScanAttendance;
