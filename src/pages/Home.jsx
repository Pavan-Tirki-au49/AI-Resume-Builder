import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Zap, PlayCircle } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden flex flex-col items-center justify-center p-8">

            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[var(--accent-secondary)]/20 rounded-full blur-[96px] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl w-full text-center flex flex-col items-center gap-8">

                {/* Subtle Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-tertiary)]/50 border border-[var(--border-color)] text-xs font-semibold backdrop-blur-sm animate-fade-in-up">
                    <Zap size={12} className="text-[var(--accent-primary)]" />
                    <span className="bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">AI-Powered Resume Builder</span>
                </div>

                {/* Headline */}
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-lg">
                    Build a Resume <br /> That Gets Read.
                </h1>

                <p className="max-w-xl text-lg text-[var(--text-secondary)] leading-relaxed">
                    Craft professional, ATS-friendly resumes in minutes with our intelligent builder.
                    Focus on your career story, we'll handle the formatting.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
                    <button
                        onClick={() => navigate('/builder')}
                        className="group px-8 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl font-bold text-white shadow-lg shadow-[var(--accent-primary)]/25 hover:shadow-[var(--accent-primary)]/40 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        Start Building Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => navigate('/preview')}
                        className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)]/50 rounded-xl font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-white transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                    >
                        <PlayCircle size={18} /> View Examples
                    </button>
                </div>

            </div>

            {/* Footer minimal */}
            <div className="absolute bottom-8 text-xs text-[var(--text-secondary)]/50 flex gap-6">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>© 2026 AI Resume Builder</span>
            </div>
        </div>
    );
};

export default Home;
