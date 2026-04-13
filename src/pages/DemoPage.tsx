import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Box } from 'lucide-react';

export function DemoPage() {
  const containerRef = useRef(null);
  
  // Track scroll progress purely within this local container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start tracking when the top of the container hits the top edge of screen.
    // End tracking when the bottom of the container hits the bottom of the screen.
    offset: ["start start", "end end"]
  });

  // Calculate the explosion progress. 
  // It explodes between 20% and 50% scroll, stays exploded, then maybe collapses later.
  const explodeAmount = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  const layer1Y = useTransform(explodeAmount, [0, 1], [0, -180]);
  const layer2Y = useTransform(explodeAmount, [0, 1], [0, 0]);
  const layer3Y = useTransform(explodeAmount, [0, 1], [0, 180]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-green-400 hover:text-green-300 font-medium text-sm tracking-wide">
            ← BACK TO MAIN SITE
          </Link>
          <span className="text-slate-400 text-sm font-semibold tracking-widest uppercase">
            Interactive Concept Demo
          </span>
        </div>
      </header>

      {/* Intro Space */}
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold tracking-widest uppercase mb-6">
            Option 4: Scroll Exploded View
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
            See the big picture.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            This is a functional prototype. As you seamlessly scroll down, the generic static graphic splits apart into its constituent 3D BIM layers—perfect for visually explaining clash detection without long text.
          </p>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mt-16 text-slate-500 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest font-bold">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent"></div>
          </motion.div>
        </div>
      </div>

      {/* Isometric Scroll Area - Tall container to allow scrolling */}
      <div ref={containerRef} className="h-[250vh] relative">
        {/* Sticky section that holds the visuals in place while the user scrolls through the h-[250vh] */}
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          
          <div className="relative w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left side: Exploded 3D model */}
            <div className="relative h-[600px] w-full flex items-center justify-center" style={{ perspective: "2000px" }}>
              <motion.div 
                className="relative w-80 h-80"
                style={{ 
                  transformStyle: "preserve-3d",
                  rotateX: 60, 
                  rotateZ: -45,
                }}
              >
                {/* Top Layer: Architectural (Glass/Walls) */}
                <motion.div 
                  className="absolute inset-0 bg-blue-500/10 border border-blue-400/40 rounded-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex items-center justify-center"
                  style={{ y: layer1Y, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                >
                  {/* Counter-rotate text so it faces camera */}
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)'}}>
                     <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30 whitespace-nowrap mb-2 shadow-lg backdrop-blur-md">Architectural Envelope</span>
                  </div>
                </motion.div>

                {/* Middle Layer: Fire Protection / MEP */}
                <motion.div 
                  className="absolute inset-0 bg-green-500/10 border-2 border-green-400/50 rounded-xl shadow-[0_30px_60px_rgba(34,197,94,0.15)] flex items-center justify-center z-10"
                  style={{ y: layer2Y, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                >
                   {/* Simulating pipework with simple SVG paths */}
                  <svg className="absolute inset-4 overflow-visible opacity-70" viewBox="0 0 100 100">
                    <path d="M 20 20 L 80 20 L 80 80" fill="none" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 50 20 L 50 80" fill="none" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="50" r="5" fill="#22c55e" />
                    <circle cx="80" cy="50" r="5" fill="#22c55e" />
                    <circle cx="20" cy="20" r="5" fill="#22c55e" />
                  </svg>

                  {/* Counter-rotate text */}
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-2" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)'}}>
                     <span className="bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm font-bold border border-green-400 shadow-xl shadow-green-500/20 whitespace-nowrap translate-x-4 -translate-y-8">
                       ✓ 0 Clashes Detected
                     </span>
                     <span className="bg-slate-900/80 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-400/30 whitespace-nowrap shadow-lg backdrop-blur-md">Fire Protection (MEP)</span>
                  </div>
                </motion.div>

                {/* Bottom Layer: Structural */}
                <motion.div 
                  className="absolute inset-0 bg-slate-800/60 border border-slate-600/50 rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex items-center justify-center"
                  style={{ y: layer3Y }}
                >
                  {/* Grid pattern for structure */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-2 opacity-20">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border border-slate-400 rounded-sm"></div>
                    ))}
                  </div>

                  {/* Counter-rotate text */}
                  <div className="absolute w-full h-full p-4 flex flex-col items-center justify-center" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)'}}>
                     <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-600 shadow-lg whitespace-nowrap">Structural Core</span>
                  </div>
                </motion.div>
                
              </motion.div>
            </div>

            {/* Right side: Explanatory Text */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ margin: "-200px" }}
              >
                <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight">Full-Stack Coordination</h2>
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                  <p>
                    Instead of a flat photo of a screen, this interactive element proves <strong className="text-white">deep understanding</strong> of how a building is put together.
                  </p>
                  <p>
                    By tying the 3D explosion to the user's scroll wheel, it makes the expertise highly engaging. It visually explains that Sprinkler Design NZ doesn't just draw lines—you engineer systems that fit flawlessly between the architecture and the core structure.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                    <div className="text-blue-400 font-bold mb-1">Layer 1</div>
                    <div className="text-sm text-slate-400">Architectural Shell</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="text-green-400 font-bold mb-1">Layer 2</div>
                    <div className="text-sm text-slate-400">Fire Protection Model</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      <div className="h-[50vh] flex flex-col gap-6 text-center items-center justify-center border-t border-slate-800/60 bg-slate-900/30">
        <h3 className="text-2xl font-bold text-white">Like what you see?</h3>
        <p className="text-slate-400 max-w-md">
          This was built in React natively, meaning no slow loading video files or heavy images. It runs blazing fast on any device.
        </p>
        <Link to="/" className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-lg transition-colors shadow-lg shadow-green-500/25">
          Take me back to the real site
        </Link>
      </div>

    </div>
  );
}
