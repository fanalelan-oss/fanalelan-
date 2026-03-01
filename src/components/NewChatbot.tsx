'use client';

import { useState, useEffect, useRef } from 'react';
import { getGeminiResponse } from '@/app/actions';
import * as THREE from 'three';

// Define the Message type
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  loading?: boolean;
};


// --- 3D Icon Component ---
const ChatbotIcon = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const isBlinking = useRef(false);
    const blinkStep = useRef(0);

    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // --- Basic Scene Setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 7;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // --- Lighting (FURTHER ENHANCED) ---
        const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambLight);
        const studioLight = new THREE.DirectionalLight(0xffffff, 2.5);
        studioLight.position.set(5, 5, 5);
        scene.add(studioLight);
        const topLight = new THREE.PointLight(0xffffff, 1.0, 20);
        topLight.position.set(0, 5, 0);
        scene.add(topLight);
        const pointLight = new THREE.PointLight(0xff9900, 5.0, 18); // Increased intensity and range
        pointLight.position.set(2, 2, 4);
        scene.add(pointLight);

        // --- Robot Model (ENHANCED GLOW) ---
        const headGroup = new THREE.Group();
        scene.add(headGroup);

        const headMat = new THREE.MeshStandardMaterial({
            color: 0xff7700,
            roughness: 0.1,
            metalness: 0.7,
            emissive: 0xaa5500, // Brighter emissive color
            emissiveIntensity: 0.4 // Increased emissive intensity
        });
        const head = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), headMat);
        headGroup.add(head);

        const visorMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.02,
            metalness: 1.0
        });
        const visor = new THREE.Mesh(new THREE.SphereGeometry(1.51, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.32), visorMat);
        visor.rotation.x = Math.PI * 0.54;
        headGroup.add(visor);

        const faceGroup = new THREE.Group();
        headGroup.add(faceGroup);

        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const leftEye = new THREE.Mesh(new THREE.CircleGeometry(0.18, 32), eyeMat);
        leftEye.position.set(-0.45, 0.35, 1.45);
        faceGroup.add(leftEye);

        const rightEye = leftEye.clone();
        rightEye.position.x = 0.45;
        faceGroup.add(rightEye);

        const mouth = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.35, 64, 1, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
        mouth.position.set(0, -0.38, 1.47);
        mouth.rotation.set(0.2, Math.PI, Math.PI);
        faceGroup.add(mouth);

        const accessoryMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.1 });
        const earGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.2, 32);
        const lEar = new THREE.Mesh(earGeo, accessoryMat);
        lEar.rotation.z = Math.PI / 2;
        lEar.position.set(-1.55, 0, 0);
        headGroup.add(lEar);
        const rEar = lEar.clone();
        rEar.position.x = 1.55;
        headGroup.add(rEar);

        // --- Blinking Logic ---
        const scheduleBlink = () => {
            const nextBlink = Math.random() * 4000 + 2000;
            setTimeout(() => {
                isBlinking.current = true;
                blinkStep.current = 0;
                scheduleBlink();
            }, nextBlink);
        };
        scheduleBlink();
        
        // --- Mouse Interaction ---
        const mouse = new THREE.Vector2();
        const targetRotation = new THREE.Vector2();
        const onMouseMove = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            const maxRotationY = Math.PI / 2; 
            const maxRotationX = Math.PI / 3; 

            targetRotation.y = THREE.MathUtils.clamp(mouse.x * 0.45, -maxRotationY, maxRotationY);
            targetRotation.x = THREE.MathUtils.clamp(-mouse.y * 0.25, -maxRotationX, maxRotationX);
        };
        window.addEventListener('mousemove', onMouseMove);

        // --- Animation Loop ---
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.05;

            headGroup.position.y = Math.sin(time * 0.6) * 0.12;
            headGroup.rotation.y += (targetRotation.y - headGroup.rotation.y) * 0.08;
            headGroup.rotation.x += (targetRotation.x - headGroup.rotation.x) * 0.08;
            headGroup.rotation.z = Math.sin(time * 0.4) * 0.03;

            faceGroup.position.x = mouse.x * 0.025;
            faceGroup.position.y = mouse.y * 0.025;
            
            if (isBlinking.current) {
                blinkStep.current += 0.25;
                const scale = 1 - Math.abs(Math.sin(blinkStep.current * Math.PI));
                leftEye.scale.y = scale < 0.1 ? 0.01 : scale;
                rightEye.scale.y = scale < 0.1 ? 0.01 : scale;
                if (blinkStep.current >= 1) {
                    isBlinking.current = false;
                    leftEye.scale.y = 1;
                    rightEye.scale.y = 1;
                }
            }
            
            renderer.render(scene, camera);
        };
        animate();

        // --- Resize Handling ---
        const handleResize = () => {
            const { clientWidth, clientHeight } = currentMount;
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(clientWidth, clientHeight);
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(currentMount);

        // --- Cleanup ---
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            resizeObserver.unobserve(currentMount);
            if (currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
};


// --- Main Chatbot Component ---
export default function NewChatbot() {
    const [isVisible, setIsVisible] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', text: 'يا هلا بك! أنا فن، خبيرك في الكلادينج واللوحات. آمرني وش بغيت تسأل عنه؟ أبشر بسعدك!', sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [hintIndex, setHintIndex] = useState(0);
    const hints = [
        { text: "عندك استفسار؟ اسألني هنا! ✨", btn: "اسأل فن 🦾", link: null },
        { text: "راسلنا واتساب مباشرة 🟢", btn: "واتساب", link: "https://wa.me/966557517792" },
        { text: "موقعنا على الخريطة 📍", btn: "الخريطة", link: "https://share.google/yok3tFEnIDCu8AZbY" },
        { text: "تابع جديد أعمالنا! 👍", btn: "فيسبوك", link: "https://www.facebook.com/profile.php?id=61587226595703" }
    ];
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!isChatOpen && isVisible) {
            const timer = setInterval(() => {
                setHintIndex((prev) => (prev + 1) % hints.length);
            }, 3000);
            return () => clearInterval(timer);
        }
    }, [isChatOpen, hints.length, isVisible]);

    const toggleChat = () => setIsChatOpen(!isChatOpen);
    
    const handleSendMessage = async () => {
        const text = inputValue.trim();
        if (!text) return;
        const userMsg: Message = { id: `u-${Date.now()}`, text, sender: 'user' };
        const loadingMsg: Message = { id: `b-l-${Date.now()}`, text: 'قاعد أفكر...', sender: 'bot', loading: true };
        setMessages(prev => [...prev, userMsg, loadingMsg]);
        setInputValue('');
        try {
            const botResponse = await getGeminiResponse(text);
            const newBotMsg: Message = { id: `b-r-${Date.now()}`, text: botResponse, sender: 'bot' };
            setMessages(prev => prev.map(m => m.id === loadingMsg.id ? newBotMsg : m));
        } catch (error) {
            console.error("Chatbot send message error:", error);
            const errorMsg: Message = { id: loadingMsg.id, text: "يا هلا بك! حصل التماس بسيط، تواصل معنا واتساب!", sender: 'bot' };
            setMessages(prev => prev.map(m => m.id === loadingMsg.id ? errorMsg : m));
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-col items-center z-[9999]">
            {!isChatOpen && (
                <div className="mb-2 bg-[#1a1b1e]/95 backdrop-blur-xl border border-[#ff9000]/40 p-2 sm:p-3 rounded-xl rounded-br-none shadow-2xl max-w-[120px] sm:max-w-[160px] text-center">
                    <div key={hintIndex} className="animate-in fade-in zoom-in-95 duration-500">
                        <p className="text-white text-[9px] sm:text-xs leading-tight mb-1.5 font-bold">{hints[hintIndex].text}</p>
                        {hints[hintIndex].link ? (
                            <a href={hints[hintIndex].link!} target="_blank" rel="noopener noreferrer" className="block w-full py-1 bg-[#ff9000] text-white text-center rounded-lg text-[8px] sm:text-[10px] font-black shadow-md">{hints[hintIndex].btn}</a>
                        ) : (
                            <button onClick={toggleChat} className="block w-full py-1 bg-[#ff9000] text-white text-center rounded-lg text-[8px] sm:text-[10px] font-black shadow-md">{hints[hintIndex].btn}</button>
                        )}
                    </div>
                </div>
            )}

            {isChatOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:relative sm:mb-6 w-full h-full sm:w-[380px] sm:h-[550px] bg-[#1a1b1e]/98 backdrop-blur-2xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-4 bg-[#ff9000] flex justify-between items-center text-white shadow-md text-right" dir="rtl">
                        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">🦾</div><span className="font-bold">مساعد فن الذكي</span></div>
                        <button onClick={toggleChat} className="text-2xl hover:opacity-70">✕</button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" dir="rtl">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm ${msg.sender === 'user' ? 'bg-[#ff9000] text-white rounded-br-none font-medium' : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10" dir="rtl">
                        <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-1.5 focus-within:ring-1 ring-[#ff9000]">
                            <input type="text" placeholder="اكتب سؤالك هنا..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-transparent border-none text-white outline-none text-sm" />
                            <button onClick={handleSendMessage} className="bg-[#ff9000] text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg></button>
                        </div>
                    </div>
                </div>
            )}
            
            {!isChatOpen && (
                <button onClick={toggleChat} className="group relative w-24 h-24 transition-all hover:scale-110 active:scale-95">
                    <ChatbotIcon />
                </button>
            )}
        </div>
    );
}