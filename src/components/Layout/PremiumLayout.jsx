import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { STEPS } from '../../lib/steps';
import { CheckCircle, AlertCircle, Copy, ExternalLink, ChevronRight, ChevronLeft, Upload, CheckSquare, Square, RefreshCcw } from 'lucide-react';

const PremiumLayout = ({ children, stepId, promptText, buildLink = "https://lovable.dev" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentStep = STEPS.find(s => s.id === stepId);
    const [artifact, setArtifact] = useState(null);
    const [status, setStatus] = useState('pending'); // pending, success, error

    // New validation states
    const [activeTab, setActiveTab] = useState('verify'); // verify, break, submit
    const [checkedItems, setCheckedItems] = useState({}); // { 0: true, 1: false ... }
    const [breakItems, setBreakItems] = useState({});

    useEffect(() => {
        // Load artifact
        const saved = localStorage.getItem(`rb_step_${stepId}_artifact`);
        if (saved) {
            setArtifact(saved);
            setStatus('success');
        }

        // Load verification status
        const savedChecks = localStorage.getItem(`rb_step_${stepId}_checks`);
        if (savedChecks) setCheckedItems(JSON.parse(savedChecks));

        const savedBreaks = localStorage.getItem(`rb_step_${stepId}_breaks`);
        if (savedBreaks) setBreakItems(JSON.parse(savedBreaks));

    }, [stepId]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                localStorage.setItem(`rb_step_${stepId}_artifact`, base64);
                setArtifact(base64);
                setStatus('success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText);
        // alert("Copied to clipboard!");
    };

    const toggleVerification = (index) => {
        const newChecks = { ...checkedItems, [index]: !checkedItems[index] };
        setCheckedItems(newChecks);
        localStorage.setItem(`rb_step_${stepId}_checks`, JSON.stringify(newChecks));
    };

    const toggleBreakTest = (index) => {
        const newBreaks = { ...breakItems, [index]: !breakItems[index] };
        setBreakItems(newBreaks);
        localStorage.setItem(`rb_step_${stepId}_breaks`, JSON.stringify(newBreaks));
    };

    const isVerified = currentStep?.verification?.every((_, idx) => checkedItems[idx]);
    // Break tests are optional but good to track
    const isBreakTested = currentStep?.breakTests?.every((_, idx) => breakItems[idx]);

    const isNextDisabled = !artifact || !isVerified;

    const handleNext = () => {
        if (stepId < 8) {
            navigate(STEPS[stepId].path);
        } else {
            navigate('/rb/proof');
        }
    };

    const handlePrev = () => {
        if (stepId > 1) {
            navigate(STEPS[stepId - 2].path);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans">
            {/* Top Bar */}
            <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center font-bold text-white">RB</div>
                    <span className="font-bold text-lg tracking-tight">AI Resume Builder</span>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Project 3</span>
                    <span className="font-medium">Step {stepId} of 8: {currentStep?.name}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'success' ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                        {status === 'success' ? 'Completed' : 'In Progress'}
                    </span>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Main Workspace (70%) */}
                <div className="w-[70%] flex flex-col border-r border-[var(--border-color)] overflow-y-auto custom-scrollbar">
                    {/* Context Header */}
                    <div className="bg-[var(--bg-primary)] p-8 pb-4">
                        <h1 className="text-3xl font-bold mb-2 text-white">{currentStep?.name}</h1>
                        <p className="text-[var(--text-secondary)]">Follow the instructions below to complete this step.</p>
                    </div>

                    <div className="flex-1 p-8 pt-4">
                        {children}
                    </div>

                    {/* Proof Footer (Workspace Navigation) */}
                    <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center">
                        <button
                            onClick={handlePrev}
                            disabled={stepId === 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isNextDisabled}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${isNextDisabled ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] cursor-not-allowed' : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent-primary)]/20'}`}
                        >
                            Next Step <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Build Panel (30%) */}
                <div className="w-[30%] bg-[var(--bg-secondary)] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                    {/* Prompt Section */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-uppercase text-[var(--text-secondary)] tracking-wider font-bold">Build Instructions</label>
                        <div className="relative group">
                            <textarea
                                className="w-full h-32 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-4 text-xs font-mono text-[var(--text-secondary)] resize-none focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                                value={promptText}
                                readOnly
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-2 bg-[var(--bg-tertiary)] rounded-md hover:bg-[var(--accent-primary)] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                title="Copy to Clipboard"
                            >
                                <Copy size={14} />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex-1 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Copy size={14} /> Copy Prompt
                            </button>

                            <a
                                href={buildLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg text-white text-xs font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            >
                                Build <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    <div className="h-px bg-[var(--border-color)] my-2"></div>

                    {/* Verification / Break / Submit Tabs */}
                    <div className="flex border-b border-[var(--border-color)] mb-2">
                        <button
                            onClick={() => setActiveTab('verify')}
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'verify' ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Verify {Object.values(checkedItems).filter(Boolean).length}/{currentStep?.verification?.length || 0}
                        </button>
                        <button
                            onClick={() => setActiveTab('break')}
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'break' ? 'border-[var(--accent-secondary)] text-[var(--accent-secondary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Break {Object.values(breakItems).filter(Boolean).length}/{currentStep?.breakTests?.length || 0}
                        </button>
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'submit' ? 'border-[var(--success)] text-[var(--success)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                            Submit
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        {activeTab === 'verify' && (
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm font-bold">Verify it works</h3>
                                {currentStep?.verification?.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 hover:bg-[var(--bg-primary)] rounded transition-colors cursor-pointer" onClick={() => toggleVerification(idx)}>
                                        <div className={`mt-0.5 ${checkedItems[idx] ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'}`}>
                                            {checkedItems[idx] ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </div>
                                        <span className={`text-sm ${checkedItems[idx] ? 'text-[var(--text-primary)] line-through opacity-50' : 'text-[var(--text-secondary)]'}`}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'break' && (
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm font-bold flex items-center gap-2"><RefreshCcw size={14} /> Try to break it</h3>
                                <p className="text-xs text-[var(--text-secondary)] mb-2">Before submitting, try these edge cases:</p>
                                {currentStep?.breakTests?.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 hover:bg-[var(--bg-primary)] rounded transition-colors cursor-pointer" onClick={() => toggleBreakTest(idx)}>
                                        <div className={`mt-0.5 ${breakItems[idx] ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                                            {breakItems[idx] ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </div>
                                        <span className={`text-sm ${breakItems[idx] ? 'text-[var(--text-primary)] line-through opacity-50' : 'text-[var(--text-secondary)]'}`}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'submit' && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-sm font-bold">Upload Proof</h3>

                                {!isVerified && (
                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500">
                                        <AlertCircle size={14} className="inline mr-1" />
                                        Please complete all verification items first.
                                    </div>
                                )}

                                <div className={`flex flex-col gap-2 ${!isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer hover:border-[var(--accent-primary)] hover:bg-[var(--bg-primary)] transition-all">
                                        {artifact ? (
                                            <div className="relative w-full h-full p-2">
                                                <img src={artifact} alt="Proof" className="w-full h-full object-contain rounded" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                                                    <span className="text-xs text-white">Change Image</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-[var(--text-secondary)]" />
                                                <p className="text-xs text-[var(--text-secondary)]">Click to upload screenshot</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                    <p className="text-[10px] text-[var(--text-secondary)] text-center">Required to proceed to next step.</p>
                                </div>

                                {status === 'success' && isVerified && (
                                    <div className="p-3 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg text-xs text-[var(--success)] flex items-center gap-2">
                                        <CheckCircle size={14} />
                                        Ready for Next Step!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumLayout;
