import { Navbar } from "@/components/ui/navbar";
import { InteractiveBackground } from "@/components/ui/interactive-background";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, MotionConfig } from "framer-motion";

// Throttle function for performance optimization
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

// TiltCard Component inspired by React Bits
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
  transitionDuration?: number;
}

function TiltCard({
  children,
  className = "",
  tiltMaxAngleX = 15,
  tiltMaxAngleY = 15,
  perspective = 1000,
  scale = 1.02,
  transitionDuration = 400
}: TiltCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    throttle((e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;

      const rotateX = ((y - centerY) / centerY) * tiltMaxAngleX;
      const rotateY = ((centerX - x) / centerX) * tiltMaxAngleY;

      setRotate({ x: rotateX, y: rotateY });
    }, 100),
    [tiltMaxAngleX, tiltMaxAngleY]
  );

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`${className} transition-all will-change-transform`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(${perspective}px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${rotate.x !== 0 || rotate.y !== 0 ? scale : 1})`,
        transition: `transform ${transitionDuration}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
      }}
    >
      {children}
    </div>
  );
}



// Dashboard Component with Scroll-based Rotation
function DashboardSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [25, -25]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-[1200px] mx-auto"
      initial={{ scale: 0.8, opacity: 0, y: 100 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      viewport={{ once: true, amount: 0.2 }}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-full mx-auto overflow-hidden rounded-[20px] shadow-2xl"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center bottom",
          rotateX,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
        }}
      >
        {/* CellBot Interface Recreation */}
        <div className="min-h-[600px] md:min-h-[700px]">
          {/* Browser Header */}
          <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-md px-3 py-1 text-sm text-white/80 border border-white/20">
                chat.cellverse.ai
              </div>
            </div>
          </div>

          {/* Interface Content */}
          <div className="flex min-h-[600px]">
            {/* Sidebar */}
            <div className="w-48 bg-gray-800/40 backdrop-blur-sm border-r border-white/10 p-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span className="font-medium text-white">CellBot</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white/70">BETA</span>
              </div>

              <button className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 text-sm font-medium mb-6">
                Ask CellBot
              </button>

              <div className="space-y-2">
                <div className="text-sm font-medium text-white">All Chats</div>
                <div className="text-xs text-white/60">Recent Chats</div>
                <div className="text-center text-white/40 text-xs mt-8">
                  Looks empty here. Start a new chat.
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-6 text-center">
                <h1 className="text-2xl font-semibold text-white mb-2">
                  Hi there! I'm <span className="text-blue-400">CellBot</span>
                </h1>
                <p className="text-white/80 max-w-2xl mx-auto">
                  Your medical research companion providing evidence-based insights from peer-reviewed literature, clinical trials, and reputed medical sources.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="px-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔬</span>
                      <h3 className="font-medium text-white">Medical Research</h3>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      Evidence from clinical trials, systematic reviews, and emerging research across medical specialties.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">Genomics</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">Microbiome & IBD</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">Immunotherapy advances</span>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-white/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💊</span>
                      <h3 className="font-medium text-white">Medications & Treatments</h3>
                    </div>
                    <p className="text-sm text-white/70 mb-3">
                      Medication classes, mechanisms of action, dosing considerations, and evidence for common treatments.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">Dosage</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">T2DM medications</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">Anticoagulant reversal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="mt-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800/30 backdrop-blur-sm border border-white/20 rounded-lg p-4 flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="What gene mutations are linked to autism spectrum disorders?"
                      className="flex-1 outline-none text-white placeholder-white/50 bg-transparent"
                      readOnly
                    />
                    <button className="bg-blue-600 text-white w-8 h-8 rounded-md flex items-center justify-center">
                      →
                    </button>
                  </div>
                  <p className="text-xs text-white/60 text-center mt-3">
                    Disclaimer: CellBot offers research-based information to aid medical professionals. CellBot's responses should be critically evaluated and verified through authoritative sources before clinical application. This tool does not replace professional judgment or continuing medical education.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced multiple fade overlays for seamless blending */}

        {/* Primary bottom fade - strongest */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/95 via-black/80 via-black/60 via-black/40 via-black/20 to-transparent pointer-events-none"></div>

        {/* Secondary bottom fade for extra smoothness */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/70 via-black/40 to-transparent pointer-events-none"></div>

        {/* Left edge fade */}
        <div className="absolute bottom-0 left-0 top-1/3 w-20 bg-gradient-to-r from-black/50 via-black/30 via-black/15 to-transparent pointer-events-none"></div>

        {/* Right edge fade */}
        <div className="absolute bottom-0 right-0 top-1/3 w-20 bg-gradient-to-l from-black/50 via-black/30 via-black/15 to-transparent pointer-events-none"></div>
      </motion.div>
    </motion.div>
  );
}

// Product Carousel Component
function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const products = [
    {
      id: 1,
      title: "CellBot",
      description: "AI-powered platform for healthcare innovation. An AI-driven platform that empowers healthcare professionals and researchers, by streamlining research, drug discovery, and care workflows with clear, actionable insights.",
      color: "bg-white/10 backdrop-blur-sm border border-white/20",
      lightColor: "from-blue-400/20"
    },
    {
      id: 2,
      title: "Knowledge Base Miner",
      description: "AI tool for extracting key insights from complex data. Advanced AI tool that extracts valuable insights from complex data, helping businesses make informed decisions based on comprehensive data analysis.",
      color: "bg-white/10 backdrop-blur-sm border border-white/20",
      lightColor: "from-purple-400/20"
    },
    {
      id: 3,
      title: "General Virtual Chatbot",
      description: "AI chatbot for 24/7 customer assistance. Intelligent AI chatbot that provides round-the-clock customer support, enhancing user experience and automating customer service operations.",
      color: "bg-white/10 backdrop-blur-sm border border-white/20",
      lightColor: "from-cyan-400/20"
    }
  ];

  // Auto-advance carousel every 4 seconds, but pause on hover
  useEffect(() => {
    if (isHovered) return; // Don't advance if hovered

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [products.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div
      className="w-full relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black via-black/50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black via-black/50 to-transparent z-10 pointer-events-none"></div>

      {/* Carousel container */}
      <div className="relative h-[300px] lg:h-[401px]">
        <div className="flex items-center justify-center h-full px-4 overflow-hidden">
          {/* Cards Container */}
          <div className="flex items-center justify-center w-full max-w-7xl gap-4 lg:gap-8">
            {/* Previous Card */}
            <motion.div
              key={`prev-${(currentIndex - 1 + products.length) % products.length}`}
              className="w-[12vw] lg:w-[18vw] h-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 0.4, scale: 0.85, x: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={`w-full h-[250px] lg:h-[320px] rounded-[16px] ${products[(currentIndex - 1 + products.length) % products.length].color} flex flex-col items-center justify-center text-center p-3 lg:p-4 relative overflow-hidden group cursor-pointer`}
                onClick={prevSlide}>
                {/* Background effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${products[(currentIndex - 1 + products.length) % products.length].lightColor} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-radial ${products[(currentIndex - 1 + products.length) % products.length].lightColor} to-transparent opacity-70 rounded-full blur-lg`}></div>

                <h3 className="text-sm lg:text-lg font-instrument-serif italic text-white relative z-10">
                  {products[(currentIndex - 1 + products.length) % products.length].title}
                </h3>
              </div>
            </motion.div>

            {/* Main Current Card */}
            <motion.div
              key={`current-${currentIndex}`}
              className="w-[70vw] lg:w-[50vw] h-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={`w-full h-[300px] lg:h-[401px] rounded-[20px] ${products[currentIndex].color} flex flex-col items-center justify-center text-center p-6 lg:p-8 relative overflow-hidden group`}>
                {/* Enhanced lighting effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${products[currentIndex].lightColor} via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
                <div className={`absolute top-0 left-0 w-48 h-48 bg-gradient-radial ${products[currentIndex].lightColor} to-transparent opacity-60 rounded-full blur-3xl`}></div>
                <div className={`absolute bottom-0 right-0 w-40 h-40 bg-gradient-radial ${products[currentIndex].lightColor} to-transparent opacity-50 rounded-full blur-2xl`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-radial ${products[currentIndex].lightColor} to-transparent opacity-30 rounded-full blur-xl`}></div>

                <motion.h3
                  className="text-2xl lg:text-3xl font-instrument-serif italic text-white mb-4 relative z-10"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {products[currentIndex].title}
                </motion.h3>
                <motion.p
                  className="text-white/80 text-sm lg:text-base max-w-md leading-relaxed relative z-10"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {products[currentIndex].description}
                </motion.p>
              </div>
            </motion.div>

            {/* Next Card */}
            <motion.div
              key={`next-${(currentIndex + 1) % products.length}`}
              className="w-[12vw] lg:w-[18vw] h-full flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 0.4, scale: 0.85, x: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={`w-full h-[250px] lg:h-[320px] rounded-[16px] ${products[(currentIndex + 1) % products.length].color} flex flex-col items-center justify-center text-center p-3 lg:p-4 relative overflow-hidden group cursor-pointer`}
                onClick={nextSlide}>
                {/* Background effects */}
                <div className={`absolute inset-0 bg-gradient-to-br ${products[(currentIndex + 1) % products.length].lightColor} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-radial ${products[(currentIndex + 1) % products.length].lightColor} to-transparent opacity-70 rounded-full blur-lg`}></div>

                <h3 className="text-sm lg:text-lg font-instrument-serif italic text-white relative z-10">
                  {products[(currentIndex + 1) % products.length].title}
                </h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {products.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${currentIndex === index
              ? "bg-blue-500 shadow-lg shadow-blue-500/30"
              : "bg-gray-400 hover:bg-gray-300"
              }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: currentIndex === index ? 1.25 : 1,
              opacity: currentIndex === index ? 1 : 0.7
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-4">
        <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: isHovered ? "0%" : "100%" }}
            transition={{
              duration: isHovered ? 0.3 : 4,
              ease: "linear",
              repeat: isHovered ? 0 : Infinity
            }}
            key={`${currentIndex}-${isHovered}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen h-full bg-black text-white font-inter relative">
      {/* Interactive Background */}
      <InteractiveBackground />

      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Dark Blue Aurora - Top Hero Section */}
        <div className="absolute top-0 left-0 right-0 h-[80vh] overflow-hidden">
          {/* Aurora Layers - Subtle and Dark - Full Width Coverage */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Layer 1 - Main Dark Aurora - Full Width */}
            <div className="absolute top-[10%] left-[-50%] w-[200%] h-[50%] bg-gradient-to-r from-blue-900/8 via-blue-900/15 via-indigo-900/20 via-blue-900/15 to-blue-900/8 opacity-40 blur-3xl animate-aurora-1 rounded-full"></div>

            {/* Layer 2 - Secondary Dark Aurora - Full Width */}
            <div className="absolute top-[30%] left-[-40%] w-[180%] h-[40%] bg-gradient-to-r from-slate-800/6 via-slate-800/12 via-blue-800/18 via-slate-800/12 to-slate-800/6 opacity-35 blur-2xl animate-aurora-2 rounded-full"></div>

            {/* Layer 3 - Accent Dark Aurora - Full Width */}
            <div className="absolute top-[5%] left-[-30%] w-[160%] h-[35%] bg-gradient-to-r from-indigo-900/5 via-indigo-900/10 via-blue-900/15 via-slate-900/12 via-blue-800/10 to-indigo-900/5 opacity-30 blur-xl animate-aurora-3 rounded-full"></div>
          </div>
        </div>

        {/* Top light source */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#223CEA]/30 rounded-full blur-[100px]" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#223CEA]/20 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#223CEA]/15 rounded-full blur-[60px]" />

        {/* Hero section blur */}
        <div className="absolute top-0 left-72 w-[607px] h-[276px] bg-blue-600/56 rounded-full blur-[50px]" />
        <div className="absolute top-[399px] left-0 w-72 h-[504px] bg-blue-600/38 rounded-full blur-[50px]" />

        {/* Services section blur */}
        <div className="absolute top-[1959px] right-0 w-[369px] h-[567px] bg-blue-600/49 rounded-full blur-[50px]" />

        {/* Evenly Distributed Blue Glows - Left Side (Bigger) */}
        <div className="absolute top-[1200px] -left-50 w-[500px] h-[320px] bg-[#223CEA]/35 rounded-full blur-[130px]" />
        <div className="absolute top-[2400px] -left-45 w-[450px] h-[290px] bg-[#3B82F6]/32 rounded-full blur-[120px]" />
        <div className="absolute top-[3600px] -left-40 w-[520px] h-[340px] bg-[#2563EB]/38 rounded-full blur-[140px]" />
        <div className="absolute top-[4800px] -left-50 w-[480px] h-[310px] bg-[#1D4ED8]/35 rounded-full blur-[125px]" />

        {/* Evenly Distributed Blue Glows - Right Side (Removed Products Section Glow) */}
        <div className="absolute top-[2000px] -right-45 w-[500px] h-[320px] bg-[#3B82F6]/36 rounded-full blur-[125px]" />
        <div className="absolute top-[3200px] -right-40 w-[470px] h-[310px] bg-[#2563EB]/32 rounded-full blur-[130px]" />
        <div className="absolute top-[4400px] -right-5 w-[510px] h-[340px] bg-[#1D4ED8]/40 rounded-full blur-[145px]" />
        <div className="absolute top-[5600px] -right-45 w-[440px] h-[280px] bg-[#1E40AF]/30 rounded-full blur-[115px]" />

        {/* Scattered Ambient Lights Throughout Page (Bigger) */}
        <div className="absolute top-[1600px] left-[8%] w-[380px] h-[240px] bg-[#4F46E5]/28 rounded-full blur-[110px]" />
        <div className="absolute top-[2800px] right-[10%] w-[420px] h-[270px] bg-[#06B6D4]/30 rounded-full blur-[120px]" />
        <div className="absolute top-[4000px] left-[12%] w-[400px] h-[250px] bg-[#3B82F6]/26 rounded-full blur-[105px]" />
        <div className="absolute top-[5200px] right-[8%] w-[450px] h-[290px] bg-[#6366F1]/33 rounded-full blur-[125px]" />

        {/* Additional Atmospheric Glows (Bigger) */}
        <div className="absolute top-[1000px] left-[18%] w-[340px] h-[220px] bg-[#223CEA]/22 rounded-full blur-[100px]" />
        <div className="absolute top-[3400px] right-[15%] w-[360px] h-[230px] bg-[#2563EB]/25 rounded-full blur-[110px]" />
        <div className="absolute top-[4600px] left-[6%] w-[390px] h-[250px] bg-[#1D4ED8]/28 rounded-full blur-[115px]" />
        <div className="absolute top-[5800px] right-[20%] w-[370px] h-[240px] bg-[#3B82F6]/24 rounded-full blur-[105px]" />

      </div>

      {/* Background grid lines - Made bigger */}
      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[1400px] h-[500px] pointer-events-none hidden lg:block">
        <svg width="1400" height="500" viewBox="0 0 1400 500" fill="none" className="w-full h-full">
          {/* 4 horizontal lines - increased spacing */}
          <path d="M0 80L1400 80" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />
          <path d="M0 180L1400 180" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />
          <path d="M0 420L1400 420" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />

          {/* 5 vertical lines - increased spacing */}
          <path d="M180 0L180 500" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />
          <path d="M380 0L380 500" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />
          <path d="M1020 0L1020 500" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />
          <path d="M1220 0L1220 500" stroke="#223DEA" strokeOpacity="0.28" gradientTransform="rotate(90)" />
        </svg>
      </div>

      {/* Navigation */}
      <Navbar />

      <div className="relative z-10">
        {/* Hero Section - Made bigger */}
        <section className="relative min-h-[120vh]">
          <div className="absolute top-[350px] left-1/2 -translate-x-1/2 w-full max-w-[800px] z-20">
            <div className="text-center px-6">
              <h1 className="text-5xl md:text-[48px] font-inter text-white leading-normal">
                We build <span className="font-instrument-serif italic">AI</span> that
                <br />
                turns <span className="font-instrument-serif italic">Ideas</span> into <span className="font-instrument-serif italic">Business Wins</span>
              </h1>
            </div>
          </div>

          {/* Subtitle below grid */}
          <div className="absolute top-[550px] left-1/2 -translate-x-1/2 w-full max-w-[800px] z-20">
            <div className="text-center px-6">
              <p className="text-[#A8B3F8] text-xl max-w-[600px] mx-auto mb-20 leading-relaxed">
                Helping companies grow with Generative AI solutions that drive innovation and opens new possibilities.
              </p>

              <button className="group relative bg-transparent border-3 border-blue-600/56 rounded-full px-12 py-6 text-white text-2xl overflow-hidden transition-all duration-500 hover:border-blue-400/80 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transform">
                {/* Animated background overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

                {/* Internal glowing border */}
                <div className="absolute inset-[3px] rounded-full border border-blue-400/40 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)] group-hover:border-blue-400/70 group-hover:shadow-[inset_0_0_25px_rgba(59,130,246,0.4)] transition-all duration-500"></div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/5 transition-all duration-300"></div>

                {/* Button text */}
                <span className="relative z-10 group-hover:text-blue-100 transition-colors duration-300">
                  Get In Touch
                </span>

                {/* Subtle particle effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-2 left-6 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-3 right-8 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-200"></div>
                  <div className="absolute top-4 right-12 w-0.5 h-0.5 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Dashboard Interface Section */}
          <motion.div
            className="relative top-[850px] max-w-7xl mx-auto px-4 pb-24"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="pt-20 pb-20">
              <DashboardSection />
            </div>
          </motion.div>
        </section>

        {/* Trusted Partners */}
        <section className="relative top-[550px] max-w-6xl mx-auto px-6 py-20">
          <div className="pt-20">
            <h2 className="text-2xl md:text-[34px] text-white text-center mb-16">
              <span className="font-inter">Our</span>{' '}
              <span className="font-instrument-serif italic">Trusted Partners</span>
            </h2>
            <div className="relative overflow-hidden w-full">
              <motion.div
                className="flex space-x-8 md:space-x-16"
                animate={{
                  x: [0, -1200],
                  opacity: [1, 1, 1]
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: [0.165, 0.84, 0.44, 1] // Smooth easeOutQuart
                  },
                  opacity: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear"
                  }
                }}
                style={{
                  willChange: "transform"
                }}
              >
                {/* First set of logos */}
                <div className="flex space-x-8 md:space-x-16 min-w-max">
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                </div>
                {/* Second set for seamless loop */}
                <div className="flex space-x-8 md:space-x-16 min-w-max">
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                </div>
                {/* Third set for extra smoothness */}
                <div className="flex space-x-8 md:space-x-16 min-w-max">
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                  <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat" className="h-8 md:h-12 opacity-60 flex-shrink-0" />
                </div>
              </motion.div>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="relative top-[650px] max-w-6xl mx-auto px-6 py-20">
          <div className="pt-20">
            <h2 className="text-2xl md:text-[34px] text-white text-center mb-16 px-6">
              <span className="font-inter">Our</span> <span className="font-instrument-serif italic">Services</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[927px] mx-auto">
              {/* Generative AI Solutions */}
              <div className="w-full h-[300px] md:h-[511px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/15 transition-all duration-300">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-blue-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Generative AI Solutions</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Cutting-edge solutions leveraging Generative AI and advanced Large Language Models (LLMs) like GPT and Anthropic to drive business innovation.
                  </p>
                </div>
              </div>

              {/* Conversational AI & Chatbots */}
              <div className="w-full h-[300px] md:h-[511px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/15 transition-all duration-300">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-purple-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Conversational AI & Chatbots</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Build intuitive, intelligent chatbots that provide accurate responses to specific prompts, enhancing business intelligence and customer engagement.
                  </p>
                </div>
              </div>

              {/* Information Mining with LLMs */}
              <div className="w-full h-[300px] md:h-[511px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/15 transition-all duration-300">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-cyan-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-cyan-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Information Mining with LLMs</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Unlock valuable insights from corporate or enterprise documents using the power of Large Language Models.
                  </p>
                </div>
              </div>

              {/* Full-stack AI Solutions */}
              <div className="w-full h-[300px] md:h-[511px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/15 transition-all duration-300">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-green-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-green-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Full-stack AI Solutions</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    End-to-end AI and LLM development, from client-server architecture, LLMOps and robust cloud deployments, ensuring a smooth and successful AI product launch.
                  </p>
                </div>
              </div>

              {/* Multi-modal LLMs */}
              <div className="w-full h-[300px] md:h-[511px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/15 transition-all duration-300">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-orange-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-orange-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Multi-modal LLMs</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Leverage AI to process and interpret various data types—text, images, audio, and video—through advanced multi-modal Large Language Models.
                  </p>
                </div>
              </div>

              {/* Vision AI */}
              <div className="w-full h-[300px] md:h-[511px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-8 md:p-12 relative overflow-hidden group hover:bg-white/15 transition-all duration-300">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-pink-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-pink-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Vision AI</h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    Transform your visual data with powerful AI algorithms for image recognition, processing, and generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="relative top-[650px] w-full py-20">
          <div className="pt-20">
            <h2 className="text-2xl md:text-[34px] text-white text-center mb-16 px-6">
              <span className="font-inter">Our</span> <span className="font-instrument-serif italic">Products</span>
            </h2>

            <ProductCarousel />
          </div>
        </section>

        {/* Graph Section */}
        <section className="relative top-[650px] max-w-6xl mx-auto px-6 py-20">
          <div className="pt-20">
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-8 md:p-12 min-h-[500px] md:h-[fit-content] flex flex-col items-center w-full overflow-hidden">
              {/* Content */}
              <div className="flex flex-col items-center h-full">
                <h2 className="text-white text-xl md:text-2xl text-center mb-16 max-w-[560px]">
                  Transforming <span className="font-instrument-serif italic">Industries</span> with<br />
                  AI innovation, webinars, and expert collaboration.
                </h2>

                <div className="flex items-end justify-center gap-4 md:gap-8 mt-auto mb-12">
                  {/* Jumpstart Projects Bar */}
                  <div className="w-24 md:w-[240px] h-48 md:h-[450px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-[20px] relative flex flex-col items-center justify-between p-3 md:p-6 group hover:bg-white/15 transition-all duration-300">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 rounded-[20px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-radial from-blue-400/30 to-transparent opacity-70 rounded-full blur-lg"></div>

                    <div className="relative z-10 text-center">
                      <div className="text-2xl md:text-5xl font-bold text-white mb-2">400+</div>
                      <div className="text-xs md:text-sm text-white/90 font-medium">
                        Jumpstart Projects
                      </div>
                    </div>

                    <div className="relative z-10 text-center">
                      <div className="text-xs md:text-sm text-white/70 leading-relaxed">
                        We've launched over 400+ innovative AI projects, accelerating solutions for various industries.
                      </div>
                    </div>
                  </div>

                  {/* Community Members Bar - Tallest */}
                  <div className="w-24 md:w-[240px] h-64 md:h-[650px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-[20px] relative flex flex-col items-center justify-between p-3 md:p-6 group hover:bg-white/15 transition-all duration-300">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 rounded-[20px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-radial from-purple-400/30 to-transparent opacity-70 rounded-full blur-xl"></div>

                    <div className="relative z-10 text-center">
                      <div className="text-2xl md:text-5xl font-bold text-white mb-2">17,000+</div>
                      <div className="text-xs md:text-sm text-white/90 font-medium">
                        Community Members
                      </div>
                    </div>

                    <div className="relative z-10 text-center">
                      <div className="text-xs md:text-sm text-white/70 leading-relaxed">
                        Our thriving community of 17,000+ AI scientists and specialists collaborates on the latest breakthroughs in the field.
                      </div>
                    </div>
                  </div>

                  {/* Webinars Bar */}
                  <div className="w-24 md:w-[240px] h-48 md:h-[450px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-[20px] relative flex flex-col items-center justify-between p-3 md:p-6 group hover:bg-white/15 transition-all duration-300">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 rounded-[20px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-radial from-cyan-400/30 to-transparent opacity-70 rounded-full blur-lg"></div>

                    <div className="relative z-10 text-center">
                      <div className="text-2xl md:text-5xl font-bold text-white mb-2">500+</div>
                      <div className="text-xs md:text-sm text-white/90 font-medium">
                        Webinars
                      </div>
                    </div>

                    <div className="relative z-10 text-center">
                      <div className="text-xs md:text-sm text-white/70 leading-relaxed">
                        We've hosted 500+ in-depth webinars, covering AI topics across all levels of complexity, empowering learners and professionals alike.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solutions */}
        <section className="relative top-[650px] max-w-6xl mx-auto px-6 py-20">
          <div className="pt-20">
            <h2 className="text-2xl md:text-[34px] text-white text-center mb-16 px-6">
              Solutions Tailored To Your <span className="font-instrument-serif italic">Industry</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[927px] mx-auto">
              {/* FreedomGPT Card */}
              <TiltCard
                className="w-full h-[300px] md:h-[647px]"
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                perspective={1200}
                scale={1.03}
                transitionDuration={600}
              >
                <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 md:p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-300 flex flex-col justify-between">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-blue-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                  {/* Main content area - placeholder for now */}
                  <div className="relative z-10 flex-1">
                    {/* Content will go here - placeholder for image/description */}
                  </div>

                  {/* Bottom section with name, button, and tags */}
                  <div className="relative z-10 mt-6">
                    {/* Name and Button Row */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-white font-instrument-serif italic">FreedomGPT</h3>
                      <button className="bg-transparent border border-white/20 rounded-lg px-4 py-2 text-white text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                        See Case
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-transparent border border-white/20 rounded-md px-3 py-1 text-xs font-medium text-white/80">AI Chatbot</span>
                      <span className="bg-transparent border border-white/20 rounded-md px-3 py-1 text-xs font-medium text-white/80">Local LLM</span>
                      <span className="bg-transparent border border-white/20 rounded-md px-3 py-1 text-xs font-medium text-white/80">Edge AI</span>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* BondView Card */}
              <TiltCard
                className="w-full h-[300px] md:h-[647px]"
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                perspective={1200}
                scale={1.03}
                transitionDuration={600}
              >
                <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-6 md:p-8 relative overflow-hidden group hover:bg-white/15 transition-all duration-300 flex flex-col justify-between">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-purple-400/20 to-transparent opacity-50 rounded-full blur-lg"></div>

                  {/* Main content area - placeholder for now */}
                  <div className="relative z-10 flex-1">
                    {/* Content will go here - placeholder for image/description */}
                  </div>

                  {/* Bottom section with name, button, and tags */}
                  <div className="relative z-10 mt-6">
                    {/* Name and Button Row */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-white font-instrument-serif italic">BondView</h3>
                      <button className="bg-transparent border border-white/20 rounded-lg px-4 py-2 text-white text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                        See Case
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-transparent border border-white/20 rounded-md px-3 py-1 text-xs font-medium text-white/80">AI Chatbot</span>
                      <span className="bg-transparent border border-white/20 rounded-md px-3 py-1 text-xs font-medium text-white/80">Full-Stack AI</span>
                      <span className="bg-transparent border border-white/20 rounded-md px-3 py-1 text-xs font-medium text-white/80">Information Mining</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative top-[650px] max-w-6xl mx-auto px-6 py-20">
          <div className="pt-20">
            <h2 className="text-white text-xl md:text-2xl text-center mb-16 max-w-[450px] mx-auto leading-tight">
              We have worked with thousands of<br />
              <span className="font-instrument-serif italic">amazing people</span>
            </h2>

            <div className="max-w-[1195px] mx-auto relative overflow-hidden h-[600px]">
              {/* Top fade overlay */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black via-black/50 to-transparent z-10 pointer-events-none"></div>

              {/* Bottom fade overlay */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {/* Column 1 - flowing up */}
                <div className="flex flex-col justify-start animate-scroll-up">
                  <div className="flex flex-col gap-4 min-h-max">
                    {/* Testimonial 1 */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      {/* Blue light effects like Aligno */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "From the moment I approached them with my project idea, the CellStrat team displayed unmatched expertise and professionalism. Their profound knowledge of deep learning algorithms and medical imaging techniques ensured accurate and efficient analysis."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Dr Ayoosh Pareek</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Sports Medicine Fellow, NY, USA</div>
                      </footer>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "..this tool has helped me quickly learn new topics that I come across in my daily lab tasks. I was able to understand different neurological disorders with ordered information."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Jenitha Sherlin</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Allied Health Professional, TN</div>
                      </footer>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "I always found google and Chatgpt's answers very immature. CellBot has eased my burden by letting me search everything in one place and answers my questions accordingly."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Aarthy Shankar</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Allied Health Professional, Vellore, TN</div>
                      </footer>
                    </div>

                    {/* Duplicate for seamless loop */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "From the moment I approached them with my project idea, the CellStrat team displayed unmatched expertise and professionalism. Their profound knowledge of deep learning algorithms and medical imaging techniques ensured accurate and efficient analysis."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Dr Ayoosh Pareek</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Sports Medicine Fellow, NY, USA</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "..this tool has helped me quickly learn new topics that I come across in my daily lab tasks. I was able to understand different neurological disorders with ordered information."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Jenitha Sherlin</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Allied Health Professional, TN</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "I always found google and Chatgpt's answers very immature. CellBot has eased my burden by letting me search everything in one place and answers my questions accordingly."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Aarthy Shankar</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Allied Health Professional, Vellore, TN</div>
                      </footer>
                    </div>
                  </div>
                </div>

                {/* Column 2 - flowing down */}
                <div className="flex flex-col justify-start animate-scroll-down">
                  <div className="flex flex-col gap-4 min-h-max">
                    {/* Testimonial 4 */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "We have enjoyed working with Vivek and his team. They are extraordinarily professional and have a keen sense of what makes sense from a product development standpoint. They have been very helpful in advising Age Of AI, LLC."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">John Arrow</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">General Partner, Age Of AI, LLC, Austin TX, USA</div>
                      </footer>
                    </div>

                    {/* Testimonial 5 */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "..this is a great tool with great vision. The team has actively incorporated the suggestions and are building a robust search platform for other subfields. Looking forward to newer capabilities."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Brian Lee</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Resident Doctor, PennState</div>
                      </footer>
                    </div>

                    {/* Testimonial 6 */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "I loved the concept that we can search across multiple medically relevant databases and quickly answer questions on day-to-day basis. This way, we can extract more value from the available resources."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Priya Sarkar</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Nurse, UK NHS</div>
                      </footer>
                    </div>

                    {/* Duplicate for seamless loop */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "We have enjoyed working with Vivek and his team. They are extraordinarily professional and have a keen sense of what makes sense from a product development standpoint. They have been very helpful in advising Age Of AI, LLC."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">John Arrow</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">General Partner, Age Of AI, LLC, Austin TX, USA</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "..this is a great tool with great vision. The team has actively incorporated the suggestions and are building a robust search platform for other subfields. Looking forward to newer capabilities."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Brian Lee</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Resident Doctor, PennState</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "I loved the concept that we can search across multiple medically relevant databases and quickly answer questions on day-to-day basis. This way, we can extract more value from the available resources."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Priya Sarkar</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Nurse, UK NHS</div>
                      </footer>
                    </div>
                  </div>
                </div>

                {/* Column 3 - flowing up */}
                <div className="flex flex-col justify-start animate-scroll-up">
                  <div className="flex flex-col gap-4 min-h-max">
                    {/* Mix of testimonials for variety */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "From the moment I approached them with my project idea, the CellStrat team displayed unmatched expertise and professionalism. Their profound knowledge of deep learning algorithms and medical imaging techniques ensured accurate and efficient analysis."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Dr Ayoosh Pareek</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Sports Medicine Fellow, NY, USA</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "We have enjoyed working with Vivek and his team. They are extraordinarily professional and have a keen sense of what makes sense from a product development standpoint. They have been very helpful in advising Age Of AI, LLC."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">John Arrow</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">General Partner, Age Of AI, LLC, Austin TX, USA</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "..this is a great tool with great vision. The team has actively incorporated the suggestions and are building a robust search platform for other subfields. Looking forward to newer capabilities."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Brian Lee</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Resident Doctor, PennState</div>
                      </footer>
                    </div>

                    {/* Duplicate for seamless loop */}
                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "From the moment I approached them with my project idea, the CellStrat team displayed unmatched expertise and professionalism. Their profound knowledge of deep learning algorithms and medical imaging techniques ensured accurate and efficient analysis."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Dr Ayoosh Pareek</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Sports Medicine Fellow, NY, USA</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "We have enjoyed working with Vivek and his team. They are extraordinarily professional and have a keen sense of what makes sense from a product development standpoint. They have been very helpful in advising Age Of AI, LLC."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">John Arrow</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">General Partner, Age Of AI, LLC, Austin TX, USA</div>
                      </footer>
                    </div>

                    <div className="w-full min-h-[180px] md:min-h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-5 flex flex-col justify-between flex-shrink-0 relative overflow-hidden group hover:bg-white/8 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-radial from-blue-400/20 to-transparent opacity-70 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-radial from-blue-400/15 to-transparent opacity-50 rounded-full blur-lg"></div>

                      <blockquote className="text-white/90 text-xs md:text-sm leading-relaxed flex-1 relative z-10 overflow-hidden">
                        "..this is a great tool with great vision. The team has actively incorporated the suggestions and are building a robust search platform for other subfields. Looking forward to newer capabilities."
                      </blockquote>
                      <footer className="mt-3 relative z-10">
                        <cite className="text-white font-medium text-xs md:text-sm">Brian Lee</cite>
                        <div className="text-white/60 text-[10px] md:text-xs leading-tight">Resident Doctor, PennState</div>
                      </footer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative top-[650px] max-w-6xl mx-auto px-6 py-20">
          <div className="pt-32">
            <div className="relative max-w-[927px] mx-auto">
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-8 md:p-12 h-[250px] md:h-[284px] flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Blue light source in the center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[60px]"></div>
                  <div className="absolute w-[200px] h-[200px] bg-blue-400/20 rounded-full blur-[40px]"></div>
                  <div className="absolute w-[100px] h-[100px] bg-blue-300/15 rounded-full blur-[20px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-[34px] text-white mb-8 max-w-full leading-normal">
                    Ready to take your<br />
                    business to <span className="font-instrument-serif italic">next level</span>?
                  </h2>

                  <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-[20px] px-8 py-4 text-white text-xl md:text-2xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg">
                    Get In Touch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative top-[750px] bg-gray-900/20 border-t border-white/10 py-16 overflow-hidden">
          {/* Aurora Background Effect - Bottom Only */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] overflow-hidden">
            {/* Fade out mask towards top */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black pointer-events-none z-10"></div>

            {/* Aurora Layers - Positioned at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-full">
              {/* Layer 1 - Main Blue Aurora */}
              <div className="absolute bottom-[10%] left-[-20%] w-[140%] h-[80%] bg-gradient-to-r from-transparent via-blue-400/35 via-blue-500/45 via-blue-400/35 to-transparent opacity-60 blur-3xl animate-aurora-1 rounded-full"></div>

              {/* Layer 2 - Secondary Blue Aurora */}
              <div className="absolute bottom-[0%] right-[-10%] w-[120%] h-[60%] bg-gradient-to-l from-transparent via-cyan-400/30 via-blue-400/40 to-transparent opacity-50 blur-2xl animate-aurora-2 rounded-full"></div>

              {/* Layer 3 - Accent Blue Aurora */}
              <div className="absolute bottom-[20%] left-[10%] w-[80%] h-[50%] bg-gradient-to-r from-indigo-400/25 via-blue-400/35 via-sky-400/30 to-cyan-400/25 opacity-40 blur-xl animate-aurora-3 rounded-full"></div>

              {/* Layer 4 - Blue Shimmer Effect */}
              <div className="absolute bottom-[-10%] left-[-30%] w-[160%] h-[70%] bg-gradient-to-r from-transparent via-blue-300/20 via-blue-400/30 via-blue-300/20 to-transparent opacity-30 blur-3xl animate-aurora-4 rounded-full"></div>
            </div>

            {/* Particle Effects - Bottom focused (Blue theme) */}
            <div className="absolute bottom-0 left-0 w-full h-full">
              <div className="absolute bottom-[30%] left-[15%] w-2 h-2 bg-blue-400/60 rounded-full animate-twinkle-1"></div>
              <div className="absolute bottom-[15%] right-[25%] w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-twinkle-2"></div>
              <div className="absolute bottom-[5%] left-[40%] w-1 h-1 bg-cyan-400/40 rounded-full animate-twinkle-3"></div>
              <div className="absolute bottom-[40%] right-[15%] w-2.5 h-2.5 bg-sky-400/45 rounded-full animate-twinkle-4"></div>
              <div className="absolute bottom-[8%] left-[60%] w-1.5 h-1.5 bg-indigo-400/35 rounded-full animate-twinkle-1"></div>
              <div className="absolute bottom-[25%] left-[75%] w-1 h-1 bg-blue-500/40 rounded-full animate-twinkle-2"></div>
            </div>
          </div>

          <div className="pt-32 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              {/* Newsletter Section */}
              <div className="mb-16 relative">
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-8 md:p-12 overflow-hidden">
                  {/* Background glow effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-radial from-blue-400/30 to-transparent opacity-70 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-radial from-purple-400/20 to-transparent opacity-50 rounded-full blur-xl"></div>

                  <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                      Join our <span className="font-instrument-serif italic">newsletter</span>
                    </h3>
                    <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
                      Sign up to our mailing list below and be the first to know about new updates. Don't worry, we hate spam too.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 text-base focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      />
                      <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-xl transition-all duration-300 hover:scale-105 transform whitespace-nowrap shadow-lg">
                        Subscribe
                      </button>
                    </div>

                    <p className="text-white/50 text-sm">
                      Subscribe for hot takes on AI and product updates. We care about your data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Footer Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                {/* Company Info */}
                <div className="lg:col-span-1">
                  <div className="mb-6">
                    <img src="https://api.builder.io/api/v1/image/assets/TEMP/289507830ea71beb34676aba5d27e7957808ff73?width=288" alt="CellStrat Logo" className="h-10 w-auto object-contain mb-4" />
                    <p className="text-white/70 text-sm leading-relaxed">
                      Helping companies grow with Generative AI solutions that drive innovation and opens new possibilities.
                    </p>
                    <div className="mt-4 space-y-1">
                      <p className="text-white/70 text-xs">2055 Limestone Rd, STE 200-C Wilmington, DE 19808 USA</p>
                      <p className="text-white/70 text-xs">Vaishnavi Signature, Marathahalli - Sarjapur Outer Ring Rd, Bellandur, Bengaluru, KA 560103 India</p>
                    </div>
                    <div className="mt-4">
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">Contact Us</a>
                    </div>
                  </div>
                </div>

                {/* CellStrat Links */}
                <div>
                  <h4 className="text-white font-medium text-base mb-4">CellStrat</h4>
                  <ul className="space-y-3">
                    <li><a href="#about" className="text-white/70 hover:text-white transition-colors text-sm">About</a></li>
                    <li><a href="#pricing" className="text-white/70 hover:text-white transition-colors text-sm">Pricing</a></li>
                    <li><a href="#careers" className="text-white/70 hover:text-white transition-colors text-sm">Careers</a></li>
                    <li><a href="#terms" className="text-white/70 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
                    <li><a href="#privacy" className="text-white/70 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                  </ul>
                </div>

                {/* Products Links */}
                <div>
                  <h4 className="text-white font-medium text-base mb-4">Products</h4>
                  <ul className="space-y-3">
                    <li><a href="#cellbot" className="text-white/70 hover:text-white transition-colors text-sm">CellBot</a></li>
                    <li><a href="#kb-miner" className="text-white/70 hover:text-white transition-colors text-sm">KB Miner</a></li>
                    <li><a href="#virtual-chatbot" className="text-white/70 hover:text-white transition-colors text-sm">Virtual Chatbot</a></li>
                  </ul>
                </div>

                {/* Services Links */}
                <div>
                  <h4 className="text-white font-medium text-base mb-4">Services</h4>
                  <ul className="space-y-3">
                    <li><a href="#generative-ai" className="text-white/70 hover:text-white transition-colors text-sm">Generative AI Solutions</a></li>
                    <li><a href="#conversational-ai" className="text-white/70 hover:text-white transition-colors text-sm">Conversational AI & Chatbots</a></li>
                    <li><a href="#information-mining" className="text-white/70 hover:text-white transition-colors text-sm">Information Mining with LLMs</a></li>
                    <li><a href="#full-stack-ai" className="text-white/70 hover:text-white transition-colors text-sm">Full-stack AI Solutions</a></li>
                    <li><a href="#multimodal-llms" className="text-white/70 hover:text-white transition-colors text-sm">Multi-modal LLMs</a></li>
                    <li><a href="#vision-ai" className="text-white/70 hover:text-white transition-colors text-sm">Vision AI</a></li>
                  </ul>
                </div>

                {/* Courses Links */}
                <div>
                  <h4 className="text-white font-medium text-base mb-4">Courses</h4>
                  <ul className="space-y-3">
                    <li><a href="#llmops" className="text-white/70 hover:text-white transition-colors text-sm">LLMOps</a></li>
                    <li><a href="#generative-ai-healthcare" className="text-white/70 hover:text-white transition-colors text-sm">Generative AI Healthcare</a></li>
                    <li><a href="#foundation-course" className="text-white/70 hover:text-white transition-colors text-sm">Foundation Course</a></li>
                    <li><a href="#ai-rx" className="text-white/70 hover:text-white transition-colors text-sm">AI Rx - Accelerating Drug Discovery with Gen AI - Project Series</a></li>
                    <li><a href="#gen-ai-healthcare" className="text-white/70 hover:text-white transition-colors text-sm">Gen AI for Healthcare Professionals</a></li>
                  </ul>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-white/10 pt-8">
                <div className="text-center">
                  <p className="text-white/70 text-sm">
                    ©CellStrat 2024, All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
