'use client';

import { useState, useEffect, useRef } from 'react';
import { getGeminiChatResponse, ChatInputMessage } from '@/app/actions';
import * as THREE from 'three';

// Define the Message type
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  image?: {
    base64: string;
    mimeType: string;
    previewUrl?: string;
  };
  loading?: boolean;
  time?: string;
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

        // --- Lighting ---
        const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambLight);
        const studioLight = new THREE.DirectionalLight(0xffffff, 2.5);
        studioLight.position.set(5, 5, 5);
        scene.add(studioLight);
        const topLight = new THREE.PointLight(0xffffff, 1.0, 20);
        topLight.position.set(0, 5, 0);
        scene.add(topLight);
        const pointLight = new THREE.PointLight(0xff9900, 5.0, 18);
        pointLight.position.set(2, 2, 4);
        scene.add(pointLight);

        // --- Robot Model ---
        const headGroup = new THREE.Group();
        scene.add(headGroup);

        const headMat = new THREE.MeshStandardMaterial({
            color: 0xff7700,
            roughness: 0.1,
            metalness: 0.7,
            emissive: 0xaa5500,
            emissiveIntensity: 0.4
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

const INITIAL_BOT_MESSAGE: Message = {
  id: 'initial',
  text: 'يا هلا ومسهلا بك في فن الإعلان! 🦾\n\nأنا "فن"، مستشارك الهندسي للكلادينج واللوحات والمقاولات بالرياض.\n\nتقدر تسألني عن أي تفاصيل أو مقاسات أو أسعار، أو ترفع صورة واجهتك ومحلك وأحللها لك فوراً!',
  sender: 'bot',
};

const SUGGESTIONS = [
  { label: '📸 تحليل واجهة محلي', action: 'upload' },
  { label: '💰 أسعار الكلادينج بالرياض', action: 'text', text: 'كم تكلفة وسعر متر الكلادينج المقاوم للحريق توريد وتركيب بالرياض؟' },
  { label: '🏢 اشتراطات لوحات بلدي', action: 'text', text: 'وش اشتراطات أمانة الرياض ومنصة بلدي لتركيب لوحات المحلات التجارية لمنع المخالفات؟' },
  { label: '✨ أفضل أنواع الحروف البارزة', action: 'text', text: 'وش الفرق بين الحروف البارزة الأكريليك والزنكور والستانلس ستيل ووش الأفضل لمحلي؟' },
];

// --- Main Chatbot Component ---
export default function NewChatbot() {
    const [isVisible, setIsVisible] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState<{
        file: File;
        previewUrl: string;
        base64: string;
        mimeType: string;
    } | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const hints = [
        { text: "عندك استفسار؟ اسألني هنا! ✨", btn: "اسأل فن 🦾", link: null },
        { text: "حلل واجهة محلك بالذكاء الاصطناعي 📸", btn: "تحليل صورة", link: null },
        { text: "راسلنا واتساب مباشرة 🟢", btn: "واتساب", link: "https://wa.me/966557517792" },
        { text: "موقعنا على الخريطة 📍", btn: "الخريطة", link: "https://maps.app.goo.gl/6yK27RgFCgv9NGSh9" },
    ];

    // Load Chat History from LocalStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('fan_chatbot_history_v2');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            }
        } catch (e) {
            console.error('Failed to load chat history:', e);
        }
        const timer = setTimeout(() => setIsVisible(true), 3500);
        return () => clearTimeout(timer);
    }, []);

    // Save Chat History to LocalStorage
    useEffect(() => {
        try {
            const cleanMessages = messages.filter(m => !m.loading);
            if (cleanMessages.length > 0) {
                localStorage.setItem('fan_chatbot_history_v2', JSON.stringify(cleanMessages.slice(-25)));
            }
        } catch (e) {
            console.error('Failed to save chat history:', e);
        }
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isCompressing]);

    // Hints rotation
    useEffect(() => {
        if (!isChatOpen && isVisible) {
            const timer = setInterval(() => {
                setHintIndex((prev) => (prev + 1) % hints.length);
            }, 3500);
            return () => clearInterval(timer);
        }
    }, [isChatOpen, hints.length, isVisible]);

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    // Reset Chat & Clear History
    const handleResetChat = () => {
        if (typeof window !== 'undefined' && window.confirm('هل تود بدء محادثة جديدة ومسح سجل الأسئلة السابقة؟')) {
            try {
                localStorage.removeItem('fan_chatbot_history_v2');
            } catch {}
            setMessages([INITIAL_BOT_MESSAGE]);
            setSelectedImage(null);
            setInputValue('');
        }
    };

    // Client-side Fast & Ultra-Compact Image Compression (max 800px, 0.7 quality)
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('الرجاء اختيار ملف صورة صالح (JPG أو PNG أو WEBP)');
            return;
        }

        setIsCompressing(true);
        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    const MAX_SIZE = 800; // Optimal for fast vision analysis

                    if (width > MAX_SIZE || height > MAX_SIZE) {
                        if (width > height) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        } else {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.70);
                    const base64 = dataUrl.split(',')[1];

                    setSelectedImage({
                        file,
                        previewUrl: dataUrl,
                        base64,
                        mimeType: 'image/jpeg',
                    });
                    setIsCompressing(false);
                };
                img.onerror = () => setIsCompressing(false);
                img.src = event.target?.result as string;
            };
            reader.onerror = () => setIsCompressing(false);
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Image compression failed:', err);
            setIsCompressing(false);
        }

        // Reset input value so same image can be reselected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Send Message
    const handleSendMessage = async (customText?: string) => {
        const text = (customText !== undefined ? customText : inputValue).trim();
        const imageToSend = selectedImage;

        // Must have either text or image
        if (!text && !imageToSend) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            text: text || 'حلل هذه الصورة المرفقة لواجهة مشروعي ووضح إذا تسوون زيها وما هي المواصفات والأسعار.',
            sender: 'user',
            image: imageToSend ? {
                base64: imageToSend.base64,
                mimeType: imageToSend.mimeType,
                previewUrl: imageToSend.previewUrl,
            } : undefined,
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };

        const loadingMsg: Message = {
            id: `b-l-${Date.now()}`,
            text: imageToSend ? 'جاري فحص ومعاينة الصورة وتحليل الواجهة هندسياً...' : 'قاعد أحلل سؤالك...',
            sender: 'bot',
            loading: true,
        };

        const updatedHistory = [...messages, userMsg];
        setMessages([...updatedHistory, loadingMsg]);
        setInputValue('');
        setSelectedImage(null);

        try {
            // Build chat history input for multimodal context
            const historyPayload: ChatInputMessage[] = updatedHistory
                .filter(m => !m.loading)
                .map(m => ({
                    id: m.id,
                    sender: m.sender,
                    text: m.text,
                    image: m.image ? {
                        base64: m.image.base64,
                        mimeType: m.image.mimeType,
                    } : undefined,
                }));

            const botResponse = await getGeminiChatResponse(historyPayload);
            const newBotMsg: Message = {
                id: `b-r-${Date.now()}`,
                text: botResponse,
                sender: 'bot',
                time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prev => prev.map(m => m.id === loadingMsg.id ? newBotMsg : m));
        } catch (error) {
            console.error("Chatbot send message error:", error);
            const errorMsg: Message = {
                id: loadingMsg.id,
                text: "يا هلا ومسهلا بك يا غالي! 🦾\nنعم ننفذ هذا النوع من الواجهات والمشاريع في الرياض بأعلى جودة كلادينج A2 مقاوم للحريق وحروف بارزة بإضاءة سامسونج كورية وضمان 15 سنة.\n\nتفضل بمراسلتنا واتساب مباشرة على 0557517792 وأبشر بسعدك!",
                sender: 'bot',
            };
            setMessages(prev => prev.map(m => m.id === loadingMsg.id ? errorMsg : m));
        }
    };

    const handleSuggestionClick = (sug: typeof SUGGESTIONS[0]) => {
        if (sug.action === 'upload') {
            fileInputRef.current?.click();
        } else if (sug.text) {
            handleSendMessage(sug.text);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex flex-col items-center z-[9999]">
            {/* Hidden File Input for Multimodal Image Upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
            />

            {/* Teaser Bubble (When chat closed) */}
            {!isChatOpen && (
                <div className="mb-2 bg-[#1a1b1e]/95 backdrop-blur-xl border border-[#ff9000]/40 p-2.5 sm:p-3 rounded-2xl rounded-br-none shadow-2xl max-w-[140px] sm:max-w-[180px] text-center">
                    <div key={hintIndex} className="animate-in fade-in zoom-in-95 duration-500">
                        <p className="text-white text-[10px] sm:text-xs leading-tight mb-2 font-bold">{hints[hintIndex].text}</p>
                        {hints[hintIndex].link ? (
                            <a href={hints[hintIndex].link!} target="_blank" rel="noopener noreferrer" className="block w-full py-1.5 bg-[#ff9000] text-black text-center rounded-xl text-[9px] sm:text-[11px] font-black shadow-md hover:bg-yellow-400 transition-colors">{hints[hintIndex].btn}</a>
                        ) : (
                            <button onClick={toggleChat} className="block w-full py-1.5 bg-[#ff9000] text-black text-center rounded-xl text-[9px] sm:text-[11px] font-black shadow-md hover:bg-yellow-400 transition-colors">{hints[hintIndex].btn}</button>
                        )}
                    </div>
                </div>
            )}

            {/* Enlarged & Spacious Chat Window Modal (Completely Scrollbar-Free) */}
            {isChatOpen && (
                <div className="fixed inset-2 sm:inset-auto sm:relative sm:mb-6 w-auto sm:w-[500px] h-[calc(100vh-24px)] sm:h-[720px] max-h-[860px] bg-[#121316]/98 backdrop-blur-2xl rounded-3xl border border-yellow-500/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                    
                    {/* Header with Official "فن" Brand Logo */}
                    <div className="px-4 py-3.5 bg-gradient-to-l from-[#ff9000] via-yellow-500 to-amber-500 flex justify-between items-center text-black shadow-lg text-right select-none" dir="rtl">
                        <div className="flex items-center gap-3">
                            {/* Official Fan Logo */}
                            <div className="w-10 h-10 rounded-2xl bg-black/90 p-1 flex items-center justify-center shadow-md border border-yellow-400/30 flex-shrink-0">
                                <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 22 H78 V45 H48 V75 H22 Z" fill="#ff9000" />
                                    <rect x="52" y="52" width="34" height="34" rx="7" fill="#ff9000" />
                                    <text x="69" y="78" fontFamily="sans-serif" fontSize="22" fontWeight="900" fill="#ffffff" textAnchor="middle">فن</text>
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-black text-black text-sm sm:text-base leading-tight">فن الإعلان - المساعد الذكي</h3>
                                <p className="text-[10.5px] font-bold text-black/85 flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-800 animate-pulse inline-block"></span>
                                    <span>مستشار هندسي متصل • فحص وتحليل الواجهات</span>
                                </p>
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-2">
                            <a
                                href="https://wa.me/966557517792"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="محادثة واتساب مباشرة"
                                aria-label="واتساب"
                                className="px-2 py-1 bg-black/15 hover:bg-black/25 text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                                <span className="text-xs">واتساب</span>
                            </a>

                            <button
                                onClick={handleResetChat}
                                title="بدء محادثة جديدة"
                                aria-label="بدء محادثة جديدة"
                                className="px-2 py-1 bg-black/15 hover:bg-black/25 text-black rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                                <span>جديد</span>
                            </button>

                            <button
                                onClick={toggleChat}
                                aria-label="إغلاق المحادثة"
                                className="w-8 h-8 flex items-center justify-center text-black hover:bg-black/20 rounded-full font-black text-base transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Messages Body (Zero scrollbar, spacious & elegant) */}
                    <div 
                        className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/60 via-neutral-950 to-black [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" 
                        dir="rtl"
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[86%] sm:max-w-[82%] p-4 rounded-2xl shadow-lg text-xs sm:text-[14.5px] leading-relaxed ${
                                    msg.sender === 'user'
                                        ? 'bg-gradient-to-br from-[#ff9000] to-yellow-600 text-black font-semibold rounded-br-none shadow-orange-950/30'
                                        : 'bg-neutral-850/95 bg-[#1b1c20] text-gray-100 rounded-bl-none border border-white/10 shadow-black/40'
                                }`}>
                                    {/* Attached Image in Message Bubble */}
                                    {msg.image?.previewUrl && (
                                        <div className="mb-3 rounded-xl overflow-hidden border border-black/20 shadow-md">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={msg.image.previewUrl}
                                                alt="صورة مرفقة للتحليل"
                                                className="w-full h-auto object-cover max-h-60"
                                            />
                                        </div>
                                    )}

                                    {/* Text Content */}
                                    <div className="whitespace-pre-line space-y-1.5 font-normal">
                                        {msg.text.split('\n').map((paragraph, idx) => (
                                            <p key={idx}>{paragraph}</p>
                                        ))}
                                    </div>

                                    {/* Loading Dots */}
                                    {msg.loading && (
                                        <div className="mt-3 flex items-center gap-2 text-yellow-400">
                                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce"></span>
                                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    )}

                                    {msg.time && (
                                        <div className={`text-[10px] mt-1.5 text-left font-sans ${msg.sender === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                                            {msg.time}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips (Zero scrollbar, horizontal scrollable without ugly track) */}
                    <div 
                        className="px-4 py-2 bg-neutral-900/95 border-t border-white/5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex gap-2" 
                        dir="rtl"
                    >
                        {SUGGESTIONS.map((sug, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(sug)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white/5 hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 border border-white/10 hover:border-yellow-500/40 transition-all flex items-center gap-1 flex-shrink-0 shadow-sm"
                            >
                                <span>{sug.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Selected Image Thumbnail Preview Strip */}
                    {selectedImage && (
                        <div className="px-4 py-2 bg-neutral-900/98 border-t border-yellow-500/40 flex items-center justify-between gap-3" dir="rtl">
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedImage.previewUrl}
                                    alt="معاينة الصورة"
                                    className="w-12 h-12 object-cover rounded-xl border border-yellow-500/50 shadow"
                                />
                                <div className="text-right">
                                    <p className="text-xs font-bold text-yellow-400 leading-tight">مرفق صورة واجهة/لوحة 📸</p>
                                    <p className="text-[10px] text-gray-400 truncate max-w-[220px]">{selectedImage.file.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs flex items-center justify-center transition-colors font-bold"
                                title="إلغاء إرفاق الصورة"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Input Controls (Spacious, rounded, modern dark gold border) */}
                    <div className="p-3.5 sm:p-4 bg-neutral-950 border-t border-white/10" dir="rtl">
                        <div className="flex items-center gap-2.5 bg-neutral-900/90 rounded-2xl px-3.5 py-2 border border-white/10 focus-within:border-yellow-500 focus-within:ring-1 ring-yellow-500/40 transition-all">
                            {/* Camera / Upload Image Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isCompressing}
                                title="إرفاق صورة واجهة أو لوحة للتحليل"
                                aria-label="إرفاق صورة"
                                className={`p-2 rounded-xl text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/15 transition-all flex-shrink-0 ${selectedImage ? 'bg-yellow-500/25 ring-1 ring-yellow-400' : ''}`}
                            >
                                {isCompressing ? (
                                    <span className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin inline-block"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                                )}
                            </button>

                            {/* Text Input Field */}
                            <input
                                type="text"
                                placeholder={selectedImage ? "أضف استفسارك حول الصورة (مثلاً: تسوون زي كذا وبكم؟)..." : "اكتب سؤالك أو اطلب معاينة واجهتك بالرياض..."}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1 bg-transparent border-none text-white outline-none text-xs sm:text-sm placeholder-gray-500"
                            />

                            {/* Send Button */}
                            <button
                                onClick={() => handleSendMessage()}
                                aria-label="إرسال الرسالة"
                                className="bg-gradient-to-r from-[#ff9000] to-yellow-500 text-black w-10 h-10 flex items-center justify-center rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex-shrink-0 font-bold"
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Robot 3D Trigger Button (When chat closed) */}
            {!isChatOpen && (
                <button onClick={toggleChat} aria-label="مساعد فن الإعلان الذكي" className="group relative w-24 h-24 transition-all hover:scale-110 active:scale-95">
                    <ChatbotIcon />
                </button>
            )}
        </div>
    );
}
