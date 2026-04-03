Currently, the system is vulnerable to spoofing. If someone holds up a high-quality photograph or a video on a tablet to the camera, the system will likely accept it and mark attendance.

This is because the current pipeline uses a **2D facial recognition model** (InspireFace Megatron) which extracts features based on visual patterns (eyes, nose, mouth), but it doesn't have depth perception or "Liveness Detection" (also known as Presentation Attack Detection or PAD).

I've actually documented this exact limitation in the report under Chapter 5, Recommendation #1:

> **5.2.2 Architectural Recommendations (Long Term)**
> 1. **Implement Liveness Detection (Anti-Spoofing):** The most significant gap in the current prototype is that it cannot differentiate between a live 3D face and a 2D photograph held up to the camera. To prevent a determined employee from buddy-punching using a photo of their colleague on a tablet, a secondary, lightweight model must be added specifically to analyse texture, depth, or require a physical action (like a blink sequence) before the ArcFace embedding is extracted.

To fix this in a real-world scenario, you would need to add an Anti-Spoofing model. Common open-source anti-spoofing models include:
1. **Silent-Face-Anti-Spoofing** (by minivision-ai on GitHub)
2. **DeepPixBiS** (Pixel-wise Binary Supervision)

These models analyze the texture of the image (photos on screens or paper have different textures than real human skin) to determine a "liveness score." You would run this check *before* extracting the Face Embedding.
