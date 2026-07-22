import React from 'react';
import { Mail, Clock } from 'lucide-react';

export function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="flex-grow flex flex-col items-center justify-center px-5 py-16 text-center max-w-2xl mx-auto w-full">
        <div className="card p-8 md:p-12 w-full">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Sprinkler Design NZ" className="w-24 h-24 object-contain" />
          </div>

          <p className="eyebrow justify-center mb-5">System Upgrade</p>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-5">
            We're building something better.
          </h1>

          <p className="text-slate-600 text-[15px] md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Sprinkler Design NZ is currently undergoing a planned system upgrade. Our new digital experience will be available shortly to deliver even better fire protection design services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto mb-8 w-full">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 text-left w-full">
              <div className="w-11 h-11 rounded-lg tint-green flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#3e7d1c]" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-0.5 m-0">Status</p>
                <p className="font-medium text-slate-900 m-0">Under Construction</p>
              </div>
            </div>

            <a href="mailto:info@sprinklerdesign.co.nz" className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-150 text-left w-full cursor-pointer">
              <div className="w-11 h-11 rounded-lg tint-green flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#3e7d1c]" />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-0.5 m-0">Need help now?</p>
                <p className="font-medium text-slate-900 m-0">Contact Us</p>
              </div>
            </a>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <p className="text-slate-500 text-sm m-0">
              Thank you for your patience.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} Sprinkler Design NZ. All rights reserved.
      </footer>
    </div>
  );
}
