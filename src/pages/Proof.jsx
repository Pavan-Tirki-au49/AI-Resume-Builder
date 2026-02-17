import React, { useState } from 'react';
import { Upload, CheckCircle, Smartphone } from 'lucide-react';

const Proof = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-12 text-[var(--text-primary)] font-sans flex flex-col items-center">

            <h1 className="text-3xl font-bold mb-4">Submission Proof</h1>
            <p className="text-[var(--text-secondary)] mb-8 max-w-lg text-center">
                Upload your deployment artifact or final build screenshot here.
                This serves as the record for your Project 3 completion.
            </p>

            <div className="w-full max-w-xl p-8 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl flex flex-col items-center gap-6">

                <div className="w-full h-64 border-2 border-dashed border-[var(--border-color)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--bg-primary)] transition-all group">
                    <Upload className="w-12 h-12 text-[var(--text-secondary)] mb-4 group-hover:text-[var(--accent-primary)] transition-colors" />
                    <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Click to upload Screenshot</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-2 opacity-50">PNG, JPG up to 10MB</span>
                </div>

                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center text-sm p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                        <span className="text-[var(--text-secondary)]">Live URL</span>
                        <span className="font-mono text-xs text-[var(--accent-primary)]">https://ai-resume-builder.vercel.app</span>
                    </div>

                    <div className="flex justify-between items-center text-sm p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                        <span className="text-[var(--text-secondary)]">GitHub Repo</span>
                        <span className="font-mono text-xs text-[var(--accent-primary)]">github.com/user/ai-resume</span>
                    </div>
                </div>

                <button className="w-full py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all">
                    <CheckCircle size={18} /> Submit for Review
                </button>

            </div>

        </div>
    );
};

export default Proof;
