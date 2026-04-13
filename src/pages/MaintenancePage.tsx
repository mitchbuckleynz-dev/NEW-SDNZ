import React from 'react';
import { motion } from 'motion/react';
import { HardHat, Compass, Mail, Clock } from 'lucide-react';

export function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e] text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-hero-dark"></div>
        <div className="absolute inset-0 dot-grid opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#4ade80] rounded-full blur-[150px] opacity-[0.03]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#22d3ee] rounded-full blur-[150px] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="card-glass p-8 md:p-12 w-full relative overflow-hidden ring-1 ring-white/10"
        >
          <div className="hero-beam top-0 left-0"></div>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#4ade80] blur-[20px] opacity-20 rounded-full logo-ring"></div>
              <div className="w-20 h-20 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center relative z-10 mx-auto">
                <HardHat className="text-[#4ade80] w-10 h-10" />
              </div>
            </div>
          </div>

          <span className="section-label mx-auto mb-6">System Upgrade</span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 leading-tight">
            We're building something <span className="text-gradient">better.</span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Sprinkler Design NZ is currently undergoing a planned system upgrade. Our new digital experience will be available shortly to deliver even better fire protection design services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mb-10 w-full">
            <div className="flex items-center gap-4 p-4 card-glass group hover:border-[#4ade80]/30 transition-colors text-left w-full">
              <div className="w-12 h-12 rounded-lg bg-[#4ade80]/10 flex items-center justify-center shrink-0 border border-[#4ade80]/20">
                <Clock className="w-6 h-6 text-[#4ade80]" />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Status</p>
                <p className="font-semibold text-white">Under Construction</p>
              </div>
            </div>
            
            <a href="mailto:info@sprinklerdesign.co.nz" className="flex items-center gap-4 p-4 card-glass group hover:border-[#4ade80]/30 transition-colors text-left w-full cursor-pointer">
              <div className="w-12 h-12 rounded-lg bg-[#22d3ee]/10 flex items-center justify-center shrink-0 border border-[#22d3ee]/20">
                <Mail className="w-6 h-6 text-[#22d3ee]" />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Need help now?</p>
                <p className="font-semibold text-white group-hover:text-[#4ade80] transition-colors">Contact Us</p>
              </div>
            </a>
          </div>

          <div className="pt-8 border-t border-white/10">
             <p className="text-slate-500 text-sm">
                Thank you for your patience.
             </p>
          </div>
        </motion.div>
      </div>
      
      <footer className="relative z-10 py-6 text-center text-slate-500 text-sm border-t border-white/5">
         &copy; {new Date().getFullYear()} Sprinkler Design NZ. All rights reserved.
      </footer>
    </div>
  );
}
