import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

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
    <div className="bg-white min-h-screen text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-[#4caf22] hover:opacity-80 font-medium text-sm tracking-wide transition-opacity">
            ← BACK TO MAIN SITE
          </Link>
          <span className="eyebrow !text-slate-400">
            Interactive Concept Demo
          </span>
        </div>
      </header>

      {/* Intro Space */}
      <div className="h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50">
        <div className="text-center max-w-2xl px-5">
          <p className="eyebrow justify-center mb-5">Option 4: Scroll Exploded View</p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-slate-900 tracking-tight">
            See the big picture.
          </h1>
          <p className="text-slate-600 text-[15px] md:text-lg leading-relaxed">
            This is a functional prototype. As you seamlessly scroll down, the generic static graphic splits apart into its constituent 3D BIM layers—perfect for visually explaining clash detection without long text.
          </p>

          <div className="mt-16 text-slate-400 flex flex-col items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] font-semibold">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-300 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Isometric Scroll Area - Tall container to allow scrolling */}
      <div ref={containerRef} className="h-[250vh] relative">
        {/* Sticky section that holds the visuals in place while the user scrolls through the h-[250vh] */}
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">

          <div className="relative w-full max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

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
                  className="absolute inset-0 bg-slate-100/70 border border-slate-300 rounded-xl shadow-sm flex items-center justify-center"
                  style={{ y: layer1Y, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                >
                  {/* Counter-rotate text so it faces camera */}
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)'}}>
                     <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300 whitespace-nowrap mb-2 shadow-sm">Architectural Envelope</span>
                  </div>
                </motion.div>

                {/* Middle Layer: Fire Protection / MEP */}
                <motion.div
                  className="absolute inset-0 tint-green rounded-xl shadow-sm flex items-center justify-center z-10"
                  style={{ y: layer2Y, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                >
                   {/* Simulating pipework with simple SVG paths */}
                  <svg className="absolute inset-4 overflow-visible opacity-80" viewBox="0 0 100 100">
                    <path d="M 20 20 L 80 20 L 80 80" fill="none" stroke="#73d63b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 50 20 L 50 80" fill="none" stroke="#73d63b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="50" r="5" fill="#4caf22" />
                    <circle cx="80" cy="50" r="5" fill="#4caf22" />
                    <circle cx="20" cy="20" r="5" fill="#4caf22" />
                  </svg>

                  {/* Counter-rotate text */}
                  <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-2" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)'}}>
                     <span className="bg-[#73d63b] text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm whitespace-nowrap translate-x-4 -translate-y-8">
                       ✓ 0 Clashes Detected
                     </span>
                     <span className="bg-white text-[#4caf22] px-3 py-1 rounded-full text-xs font-semibold border border-[#73d63b] whitespace-nowrap shadow-sm">Fire Protection (MEP)</span>
                  </div>
                </motion.div>

                {/* Bottom Layer: Structural */}
                <motion.div
                  className="absolute inset-0 bg-slate-200 border border-slate-300 rounded-xl shadow-sm flex items-center justify-center"
                  style={{ y: layer3Y }}
                >
                  {/* Grid pattern for structure */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-2 opacity-30">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border border-slate-400 rounded-sm"></div>
                    ))}
                  </div>

                  {/* Counter-rotate text */}
                  <div className="absolute w-full h-full p-4 flex flex-col items-center justify-center" style={{ transform: 'rotateX(-60deg) rotateZ(45deg)'}}>
                     <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300 shadow-sm whitespace-nowrap">Structural Core</span>
                  </div>
                </motion.div>

              </motion.div>
            </div>

            {/* Right side: Explanatory Text */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ margin: "-200px" }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-slate-900 tracking-tight">Full-stack coordination</h2>
                <div className="space-y-5 text-slate-600 text-[15px] md:text-lg leading-relaxed">
                  <p>
                    Instead of a flat photo of a screen, this interactive element proves <strong className="text-slate-900 font-semibold">deep understanding</strong> of how a building is put together.
                  </p>
                  <p>
                    By tying the 3D explosion to the user's scroll wheel, it makes the expertise highly engaging. It visually explains that Sprinkler Design NZ doesn't just draw lines—you engineer systems that fit flawlessly between the architecture and the core structure.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="card p-4">
                    <div className="text-slate-900 font-semibold mb-1">Layer 1</div>
                    <div className="text-sm text-slate-500">Architectural Shell</div>
                  </div>
                  <div className="figure-block !text-left !p-4">
                    <div className="text-slate-900 font-semibold mb-1">Layer 2</div>
                    <div className="text-sm text-slate-600">Fire Protection Model</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      <div className="h-[50vh] flex flex-col gap-5 text-center items-center justify-center border-t border-slate-200 bg-slate-50">
        <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Like what you see?</h3>
        <p className="text-slate-600 max-w-md text-[15px] leading-relaxed">
          This was built in React natively, meaning no slow loading video files or heavy images. It runs blazing fast on any device.
        </p>
        <Link to="/" className="btn-primary mt-2">
          Take me back to the real site
        </Link>
      </div>

    </div>
  );
}
