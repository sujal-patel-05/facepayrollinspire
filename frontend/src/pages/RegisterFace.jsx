import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterFace.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const RegisterFace = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '', email: '', employee_id: '', department_id: ''
    });

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [status, setStatus] = useState('filling_form'); // filling_form, ready_to_capture, processing, success, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await axios.get(`${API_URL}/departments/list`);
                setDepartments(res.data);
            } catch (err) {
                console.error("Failed to load departments", err);
            }
        };
        fetchDepts();
        return () => stopCamera();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            setIsCameraActive(true);
            setStatus('ready_to_capture');
        } catch (err) {
            console.error("Camera Error:", err);
            setErrorMsg("Camera access denied.");
            setStatus('error');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
        }
        setIsCameraActive(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        startCamera();
    };

    const captureAndSubmit = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        setStatus('processing');
        setErrorMsg('');

        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

        try {
            const res = await axios.post(`${API_URL}/employees/register-face`, {
                name: formData.name,
                email: formData.email,
                employee_id: formData.employee_id,
                department_id: parseInt(formData.department_id),
                face_image: imageBase64
            }, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });

            if (res.data && res.data.recognized) {
                setStatus('success');
                stopCamera();
            } else {
                setStatus('error');
                setErrorMsg(res.data.message || "Could not register face. Try again.");
            }
        } catch (err) {
            setStatus('error');
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setErrorMsg(err.response.data.detail);
            } else {
                setErrorMsg("Failed to connect to the server.");
            }
        }
    };

    return (
        <div className="register-app">
            <div className="split-layout">
                {/* FORM SECTION */}
                <div className="form-section">
                    <div>
                        <div style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: 'bold', marginBottom: '20px' }} onClick={() => navigate('/dashboard')}>
                            ← Back to Dashboard
                        </div>
                        <h1 className="form-title">New Employee</h1>
                        <p className="form-subtitle">Register your profile to enable face attendance.</p>

                        <form onSubmit={handleFormSubmit}>
                            <div className="input-group">
                                <label>FULL NAME</label>
                                <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleInputChange} disabled={isCameraActive} />
                            </div>
                            <div className="input-group">
                                <label>EMAIL ADDRESS</label>
                                <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleInputChange} disabled={isCameraActive} />
                            </div>
                            <div className="input-group">
                                <label>EMPLOYEE ID</label>
                                <input type="text" name="employee_id" className="form-input" required value={formData.employee_id} onChange={handleInputChange} disabled={isCameraActive} placeholder="EMP-001" />
                            </div>
                            <div className="input-group">
                                <label>DEPARTMENT</label>
                                <select name="department_id" className="form-input" required value={formData.department_id} onChange={handleInputChange} disabled={isCameraActive}>
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {!isCameraActive && (
                                <button type="submit" className="btn-primary">
                                    Start Camera Setup
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* CAMERA SECTION */}
                <div className="camera-section">
                    {!isCameraActive && status === 'filling_form' && (
                        <div style={{ color: '#64748b', textAlign: 'center' }}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.5, marginBottom: '20px' }}>
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            <h3>Camera Inactive</h3>
                            <p>Fill out the form to activate camera</p>
                        </div>
                    )}

                    <video ref={videoRef} playsInline autoPlay muted style={{ display: isCameraActive ? 'block' : 'none' }}></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                    {isCameraActive && (
                        <div className="capture-overlay">
                            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '10px', color: 'white' }}>
                                {status === 'processing' ? 'Processing Face Data...' : 'Position your face clearly in the frame'}
                            </div>

                            <div className="capture-btn" onClick={captureAndSubmit} style={{ opacity: status === 'processing' ? 0.5 : 1, pointerEvents: status === 'processing' ? 'none' : 'auto' }}>
                                <div className="capture-inner"></div>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(16, 185, 129, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <h2 style={{ marginTop: '20px' }}>Registration Complete!</h2>
                            <button onClick={() => navigate('/scan-attendance')} className="btn-primary" style={{ width: 'auto', padding: '10px 30px', marginTop: '20px', background: 'white', color: '#10b981' }}>
                                Start Taking Attendance
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(239, 68, 68, 0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <h2 style={{ marginTop: '20px' }}>Registration Failed</h2>
                            <p>{errorMsg}</p>
                            <button onClick={startCamera} className="btn-primary" style={{ width: 'auto', padding: '10px 30px', marginTop: '20px', background: 'white', color: '#ef4444' }}>
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterFace;
