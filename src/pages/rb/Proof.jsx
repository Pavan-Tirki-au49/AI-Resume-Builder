import React, { useState, useEffect } from 'react';
import { STEPS } from '../../lib/steps';
import { CheckCircle, XCircle, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChecklistItem = ({ label, checked, onChange }) => (
    <label className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer group">
        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-[var(--success)] border-[var(--success)] text-white' : 'border-[var(--text-secondary)] group-hover:border-[var(--accent-primary)]'}`}>
            {checked && <Check size={14} strokeWidth={3} />}
        </div>
        <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
        <span className={`text-sm ${checked ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}>{label}</span>
    </label>
);

const ProofPage = () => {
    // State
    const [stepStatus, setStepStatus] = useState({});
    const [links, setLinks] = useState({ lovable: '', github: '', deploy: '' });
    const [checklist, setChecklist] = useState({
        storage: false,
        preview: false,
        template: false,
        theme: false,
        ats: false,
        updates: false,
        export: false,
        empty: false,
        mobile: false,
        console: false
    });
    const [isShipped, setIsShipped] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Initial Load
    useEffect(() => {
        // Steps Status
        const status = {};
        STEPS.forEach(step => {
            const artifact = localStorage.getItem(`rb_step_${step.id}_artifact`);
            status[step.id] = !!artifact;
        });
        setStepStatus(status);

        // Links
        const savedLinks = localStorage.getItem('rb_final_submission'); // Changed key as per requirement
        if (savedLinks) setLinks(JSON.parse(savedLinks));

        // Checklist
        const savedChecklist = localStorage.getItem('rb_proof_checklist');
        if (savedChecklist) setChecklist(JSON.parse(savedChecklist));
    }, []);

    // Shipped Logic
    useEffect(() => {
        const allSteps = Object.values(stepStatus).length === 8 && Object.values(stepStatus).every(Boolean);
        const allChecklist = Object.values(checklist).every(Boolean);
        const allLinks = links.lovable && links.github && links.deploy &&
            isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);

        setIsShipped(allSteps && allChecklist && allLinks);
    }, [stepStatus, checklist, links]);

    // Helpers
    const isValidUrl = (string) => {
        if (!string) return false;
        try { new URL(string); return true; } catch (_) { return false; }
    };

    const toggleStepStatus = (stepId) => {
        const isComplete = stepStatus[stepId];
        const newStatus = { ...stepStatus, [stepId]: !isComplete };
        setStepStatus(newStatus);

        if (!isComplete) {
            localStorage.setItem(`rb_step_${stepId}_artifact`, 'manual_override');
        } else {
            localStorage.removeItem(`rb_step_${stepId}_artifact`);
        }
    };

    const handleLinkChange = (e) => {
        const newLinks = { ...links, [e.target.name]: e.target.value };
        setLinks(newLinks);
        localStorage.setItem('rb_final_submission', JSON.stringify(newLinks));
    };

    const handleChecklistChange = (key) => {
        const newChecklist = { ...checklist, [key]: !checklist[key] };
        setChecklist(newChecklist);
        localStorage.setItem('rb_proof_checklist', JSON.stringify(newChecklist));
    };

    const handleCopy = () => {
        const text = `
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
`.trim();
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const checklistItems = [
        { key: 'storage', label: 'All form sections save to localStorage' },
        { key: 'preview', label: 'Live preview updates in real-time' },
        { key: 'template', label: 'Template switching preserves data' },
        { key: 'theme', label: 'Color theme persists after refresh' },
        { key: 'ats', label: 'ATS score calculates correctly' },
        { key: 'updates', label: 'Score updates live on edit' },
        { key: 'export', label: 'Export buttons work (copy/download)' },
        { key: 'empty', label: 'Empty states handled gracefully' },
        { key: 'mobile', label: 'Mobile responsive layout works' },
        { key: 'console', label: 'No console errors on any page' }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans pb-20">
            {/* Header */}
            <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center font-bold text-white">RB</div>
                    <span className="font-bold text-lg hidden md:block">AI Resume Builder</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${isShipped ? 'bg-[var(--success)] text-white shadow-lg shadow-green-500/20' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                        {isShipped ? 'Shipped' : 'In Progress'}
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto p-6 space-y-8">

                {/* Shipped Confirmation */}
                {isShipped && (
                    <div className="bg-[var(--bg-secondary)] border border-[var(--success)]/20 rounded-xl p-8 text-center animate-in fade-in duration-700">
                        <div className="w-16 h-16 bg-[var(--success)]/10 text-[var(--success)] rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Project 3 Shipped Successfully.</h1>
                        <p className="text-[var(--text-secondary)]">All systems operational. Ready for final submission.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Requirements */}
                    <div className="space-y-8">

                        {/* A) Step Completion Overview */}
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center text-xs">1</span>
                                Build Steps
                            </h2>
                            <div className="space-y-2">
                                {STEPS.map(step => (
                                    <div
                                        key={step.id}
                                        onClick={() => toggleStepStatus(step.id)}
                                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-[var(--text-secondary)]">{String(step.id).padStart(2, '0')}</span>
                                            <span className="text-sm font-medium">{step.name}</span>
                                        </div>
                                        {stepStatus[step.id] ?
                                            <CheckCircle className="text-[var(--success)]" size={18} /> :
                                            <div className="w-4 h-4 rounded-full border-2 border-[var(--border-color)] group-hover:border-[var(--accent-primary)]" />
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* C) Validation Checklist */}
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center text-xs">2</span>
                                Validation Checklist
                            </h2>
                            <div className="space-y-2">
                                {checklistItems.map((item) => (
                                    <ChecklistItem
                                        key={item.key}
                                        label={item.label}
                                        checked={checklist[item.key]}
                                        onChange={() => handleChecklistChange(item.key)}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Submission */}
                    <div className="space-y-8">

                        {/* B) Artifact Collection */}
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center text-xs">3</span>
                                Artifacts
                            </h2>
                            <div className="space-y-4">
                                <InputGroup label="Lovable Project Link" name="lovable" value={links.lovable} onChange={handleLinkChange} placeholder="https://lovable.dev/..." valid={isValidUrl(links.lovable)} />
                                <InputGroup label="GitHub Repository" name="github" value={links.github} onChange={handleLinkChange} placeholder="https://github.com/..." valid={isValidUrl(links.github)} />
                                <InputGroup label="Deployed URL" name="deploy" value={links.deploy} onChange={handleLinkChange} placeholder="https://..." valid={isValidUrl(links.deploy)} />
                            </div>
                        </div>

                        {/* D) Final Submission */}
                        <div className={`p-6 rounded-xl border transition-all ${isShipped ? 'bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border-[var(--accent-primary)]' : 'bg-[var(--bg-tertiary)]/50 border-[var(--border-color)] opacity-75'}`}>
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center text-xs">4</span>
                                Final Submission
                            </h2>

                            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)] font-mono text-xs text-[var(--text-secondary)] mb-4 overflow-x-auto">
                                <div className="mb-2 text-[var(--text-primary)] font-bold">AI Resume Builder — Final Submission</div>
                                <div className="mb-2">Lovable: {links.lovable || '...'}</div>
                                <div className="mb-2">GitHub: {links.github || '...'}</div>
                                <div className="mb-4">Live: {links.deploy || '...'}</div>
                                <div>Core Capabilities:</div>
                                <div className="pl-4">- Structured resume builder</div>
                                <div className="pl-4">- Deterministic ATS scoring</div>
                                <div className="pl-4">- Template switching</div>
                                <div className="pl-4">- PDF export with clean formatting</div>
                                <div className="pl-4">- Persistence + validation checklist</div>
                            </div>

                            <button
                                onClick={handleCopy}
                                disabled={!isShipped}
                                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isShipped ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-lg' : 'bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed'}`}
                            >
                                {copySuccess ? <CheckCircle size={18} /> : <Copy size={18} />}
                                {copySuccess ? 'Copied to Clipboard' : 'Copy Final Submission'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, name, value, onChange, placeholder, valid }) => (
    <div>
        <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">{label}</label>
            {value && (valid ? <CheckCircle size={12} className="text-[var(--success)]" /> : <span className="text-[10px] text-[var(--error)]">Invalid URL</span>)}
        </div>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-[var(--bg-primary)] border rounded-lg p-3 text-sm focus:outline-none transition-colors ${value && !valid ? 'border-[var(--error)] focus:border-[var(--error)]' : 'border-[var(--border-color)] focus:border-[var(--accent-primary)]'}`}
        />
    </div>
);

export default ProofPage;
