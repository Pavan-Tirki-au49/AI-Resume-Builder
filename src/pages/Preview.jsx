import React, { useState, useEffect } from 'react';
import { Copy, Printer, AlertTriangle, CheckCircle } from 'lucide-react';

const Preview = () => {
    const [resumeData, setResumeData] = useState(null);
    const [template, setTemplate] = useState('Classic');
    const [themeColor, setThemeColor] = useState('hsl(168, 60%, 40%)'); // Default Teal
    const [warnings, setWarnings] = useState([]);
    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        // Load Data
        const savedData = localStorage.getItem('resumeBuilderData');
        const savedTemplate = localStorage.getItem('resumeBuilderTemplate');
        const savedColor = localStorage.getItem('resumeBuilderColor');

        if (savedData) {
            let parsed = JSON.parse(savedData);
            // Validation & Migration Check
            if (typeof parsed.skills === 'string') {
                parsed.skills = { technical: parsed.skills.split(','), soft: [], tools: [] };
            }
            setResumeData(parsed);
            validateData(parsed);
            calculateScore(parsed);
        }
        if (savedTemplate) setTemplate(savedTemplate);
        if (savedColor) setThemeColor(savedColor);
    }, []);

    const validateData = (data) => {
        const warns = [];
        if (!data.personal.name) warns.push("Missing Name");
        if (data.projects.length === 0 && data.experience.length === 0) warns.push("No Experience or Projects listed");
        setWarnings(warns);
    };

    const calculateScore = (data) => {
        let score = 0;
        let suggs = [];

        if (data.personal.name && data.personal.name.trim().length > 0) score += 10;
        else suggs.push("Add your full name (+10)");

        if (data.personal.email && /\S+@\S+\.\S+/.test(data.personal.email)) score += 10;
        else suggs.push("Add a valid email (+10)");

        if (data.summary && data.summary.length > 50) score += 10;
        else suggs.push("Expand summary > 50 chars (+10)");

        if (data.experience.length > 0 && data.experience.some(e => e.description && e.description.trim().length > 10)) score += 15;
        else suggs.push("Add experience with details (+15)");

        if (data.education.length >= 1) score += 10;
        else suggs.push("Add education (+10)");

        const totalSkills = (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + (data.skills.tools?.length || 0);
        if (totalSkills >= 5) score += 10;
        else suggs.push("Add at least 5 skills (+10)");

        if (data.projects.length >= 1) score += 10;
        else suggs.push("Add a project (+10)");

        if (data.personal.phone) score += 5;
        else suggs.push("Add phone number (+5)");

        if (data.links.linkedin) score += 5;
        else suggs.push("Add LinkedIn profile (+5)");

        if (data.links.github) score += 5;
        else suggs.push("Add GitHub profile (+5)");

        const actionVerbs = ['built', 'led', 'designed', 'improved', 'developed', 'managed', 'created', 'initiated', 'engineered', 'implemented', 'orchestrated'];
        const summaryLower = (data.summary || '').toLowerCase();
        if (actionVerbs.some(v => summaryLower.includes(v))) score += 10;
        else suggs.push("Use action verbs in summary (+10)");

        setAtsScore(Math.min(100, score));
        setSuggestions(suggs);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopyText = () => {
        if (!resumeData) return;

        const { personal, summary, experience, projects, education, skills, links } = resumeData;

        let text = `${personal.name || 'Name'}\n`;
        text += `${personal.location || ''} | ${personal.email || ''} | ${personal.phone || ''}\n`;
        text += `${links.linkedin || ''} | ${links.github || ''}\n\n`;

        if (summary) {
            text += `SUMMARY\n${summary}\n\n`;
        }

        if (experience.length > 0) {
            text += `EXPERIENCE\n`;
            experience.forEach(exp => {
                text += `${exp.title} at ${exp.company} (${exp.duration})\n`;
                text += `${exp.description}\n\n`;
            });
        }

        if (projects.length > 0) {
            text += `PROJECTS\n`;
            projects.forEach(proj => {
                text += `${proj.title}\n`;
                text += `${proj.description}\n\n`;
            });
        }

        if (education.length > 0) {
            text += `EDUCATION\n`;
            education.forEach(edu => {
                text += `${edu.institution} - ${edu.degree} (${edu.year})\n`;
            });
            text += `\n`;
        }

        if (skills && typeof skills === 'object') {
            text += `SKILLS\n`;
            if (skills.technical.length) text += `Technical: ${skills.technical.join(', ')}\n`;
            if (skills.tools.length) text += `Tools: ${skills.tools.join(', ')}\n`;
            if (skills.soft.length) text += `Soft Skills: ${skills.soft.join(', ')}\n`;
        } else if (skills) {
            text += `SKILLS\n${skills}\n`;
        }

        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    if (!resumeData) return <div className="p-10 text-center text-gray-500">Loading or No Data Found...</div>;

    const getSkills = () => {
        if (typeof resumeData.skills === 'string') return { technical: resumeData.skills.split(','), soft: [], tools: [] };
        return resumeData.skills;
    };
    const skillsObj = getSkills();
    const hasSkills = skillsObj.technical.length > 0 || skillsObj.soft.length > 0 || skillsObj.tools.length > 0;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-8 flex flex-col items-center print:bg-white print:p-0">

// ... inside render ...
            {/* Actions Bar (Hidden on Print) */}
            <div className="w-full max-w-[210mm] mb-8 flex flex-col gap-4 no-print select-none">

                {/* ATS Score Panel */}
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">

                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={226}
                                strokeDashoffset={226 - (226 * atsScore) / 100}
                                className={`transition-all duration-1000 ease-out ${atsScore >= 71 ? 'text-green-500' : atsScore >= 41 ? 'text-yellow-500' : 'text-red-500'}`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className={`text-xl font-bold ${atsScore >= 71 ? 'text-green-600' : atsScore >= 41 ? 'text-yellow-600' : 'text-red-600'}`}>{atsScore}</span>
                        </div>
                    </div>

                    {/* Text & Suggestions */}
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-gray-800 text-lg">
                                {atsScore >= 71 ? 'Strong Resume! 🚀' : atsScore >= 41 ? 'Getting There... 🚧' : 'Needs Work 🛠️'}
                            </h3>
                            <span className="text-xs text-gray-400 font-mono">ATS SCORE</span>
                        </div>

                        {suggestions.length > 0 ? (
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-red-500 text-xs uppercase tracking-wide mb-1">Top Improvements:</p>
                                {suggestions.slice(0, 2).map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <AlertTriangle size={12} className="text-red-400" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                                {suggestions.length > 2 && <div className="text-xs text-gray-400 italic">and {suggestions.length - 2} more...</div>}
                            </div>
                        ) : (
                            <div className="text-sm text-green-600 flex items-center gap-2">
                                <CheckCircle size={16} /> All systems go! Your resume is optimized.
                            </div>
                        )}
                    </div>

                    {/* Export Actions */}
                    <div className="flex flex-col gap-2 shrink-0 border-l pl-6 border-gray-100 mobile:border-0 mobile:pl-0">
                        <button
                            onClick={handleCopyText}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            {copySuccess ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                            {copySuccess ? "Copied!" : "Copy Text"}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-2 bg-[#10b981] text-white font-bold rounded-lg hover:bg-[#059669] transition-colors shadow-lg shadow-green-500/20 text-sm"
                        >
                            <Printer size={16} /> Print / PDF
                        </button>
                    </div>

                </div>
            </div>

            {/* Resume Preview (Rendered from Data) */}
            <div className="resume-paper w-[210mm] min-h-[297mm] bg-white text-black p-[20mm] shadow-2xl relative print:shadow-none print:w-full print:absolute print:top-0 print:left-0" style={{ '--theme-color': themeColor }}>

                {/* Header: Template Sensitive */}
                {/* Header: Template Sensitive */}
                <div className={`
                ${template === 'Classic' ? 'border-b-2 pb-4 mb-4 text-center' : ''}
                ${template === 'Modern' ? 'flex justify-between items-start border-l-8 pl-6 mb-8 py-2' : ''}
                ${template === 'Minimal' ? 'pb-4 mb-6 text-left border-b border-gray-200' : ''}
            `} style={{ borderColor: template === 'Modern' || template === 'Classic' ? themeColor : undefined }}>

                    <div className={template === 'Modern' ? 'text-left w-full' : ''}>
                        <h1 className={`
                        ${template === 'Classic' ? 'text-4xl font-bold uppercase tracking-wider' : ''}
                        ${template === 'Modern' ? 'text-6xl font-black tracking-tighter leading-none mb-2' : ''}
                        ${template === 'Minimal' ? 'text-3xl font-light tracking-wide text-gray-800' : ''}
                    `} style={{ color: template === 'Modern' ? themeColor : undefined }}>{resumeData.personal.name || 'Your Name'}</h1>

                        {/* Modern Layout Contact Info */}
                        {template === 'Modern' ? (
                            <div className="flex flex-col gap-1 text-sm font-medium text-gray-600 mt-4">
                                <div className="flex gap-4">
                                    {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                                    {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                                    {resumeData.personal.phone && <span>{resumeData.personal.phone}</span>}
                                </div>
                                <div className="flex gap-4 mt-1 font-bold" style={{ color: themeColor }}>
                                    {resumeData.links.linkedin && <span>{resumeData.links.linkedin}</span>}
                                    {resumeData.links.github && <span>{resumeData.links.github}</span>}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`
                                flex flex-wrap gap-3 text-sm text-gray-600 mt-2
                                ${template === 'Classic' ? 'justify-center' : ''}
                            `}>
                                    {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                                    {resumeData.personal.email && <span>• {resumeData.personal.email}</span>}
                                    {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                                </div>

                                <div className={`
                                flex gap-3 text-sm mt-1
                                ${template === 'Classic' ? 'justify-center text-gray-600' : ''}
                                ${template === 'Minimal' ? 'text-gray-500 italic' : ''}
                            `} style={{ color: template === 'Modern' ? themeColor : undefined }}>
                                    {resumeData.links.linkedin && <span className="underline">{resumeData.links.linkedin}</span>}
                                    {resumeData.links.github && <span className="underline">{resumeData.links.github}</span>}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                <div className="space-y-6">

                    {/* Summary */}
                    {resumeData.summary && (
                        <div>
                            <SectionHeader template={template} title={template === 'Modern' ? 'Professional Profile' : 'Summary'} themeColor={themeColor} />
                            <p className="text-sm leading-relaxed text-gray-800 text-justify">{resumeData.summary}</p>
                        </div>
                    )}

                    {/* Skills (New Categorized Display) */}
                    {hasSkills && (
                        <div className="mb-6 break-inside-avoid">
                            <SectionHeader template={template} title="Skills" themeColor={themeColor} />
                            <div className="grid grid-cols-1 gap-2">
                                {skillsObj.technical.length > 0 && <SkillRow category="Technical" skills={skillsObj.technical} template={template} themeColor={themeColor} />}
                                {skillsObj.tools.length > 0 && <SkillRow category="Tools" skills={skillsObj.tools} template={template} themeColor={themeColor} />}
                                {skillsObj.soft.length > 0 && <SkillRow category="Soft Skills" skills={skillsObj.soft} template={template} themeColor={themeColor} />}
                            </div>
                        </div>
                    )}


                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                        <div>
                            <SectionHeader template={template} title={template === 'Modern' ? 'Work History' : 'Experience'} themeColor={themeColor} />

                            {resumeData.experience.map((exp, i) => (
                                <div key={i} className="mb-4 break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className={`font-bold ${template === 'Modern' ? 'text-lg text-gray-900' : 'text-sm'}`}>{exp.title}</span>
                                        <span className="text-sm font-medium text-gray-600">{exp.duration}</span>
                                    </div>
                                    <div className={`text-sm italic mb-1 ${template === 'Modern' ? 'not-italic font-medium' : ''}`} style={{ color: template === 'Modern' ? themeColor : undefined }}>{exp.company}</div>
                                    {exp.description && <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                        <div>
                            <SectionHeader template={template} title={template === 'Modern' ? 'Key Projects' : 'Projects'} themeColor={themeColor} />

                            {resumeData.projects.map((proj, i) => (
                                <div key={i} className={`mb-4 break-inside-avoid ${template === 'Modern' ? 'border-l-4 pl-3' : ''}`} style={{ borderColor: template === 'Modern' ? themeColor : undefined }}>
                                    <div className="flex justify-between items-baseline">
                                        <span className={`font-bold text-sm ${template === 'Modern' ? 'text-gray-900' : ''}`}>{proj.title || proj.name}</span>
                                        <div className="flex gap-2 text-xs print:hidden">
                                            {proj.liveUrl && <span className="underline" style={{ color: themeColor }}>Live</span>}
                                            {proj.githubUrl && <span className="text-gray-600 underline">Code</span>}
                                        </div>
                                    </div>
                                    {proj.description && <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{proj.description}</p>}
                                    {/* Tech Stack Pills for Preview */}
                                    {proj.techStack && proj.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {proj.techStack.map((t, ti) => (
                                                <span key={ti} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 print:border-gray-400">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                        <div>
                            <SectionHeader template={template} title="Education" themeColor={themeColor} />
                            {resumeData.education.map((edu, i) => (
                                <div key={i} className="mb-2 break-inside-avoid">
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{edu.institution}</span>
                                        <span>{edu.year}</span>
                                    </div>
                                    <div className="text-sm">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

const SectionHeader = ({ template, title, themeColor }) => (
    <>
        {template === 'Classic' && <h3 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">{title}</h3>}
        {template === 'Modern' && <h3 className="text-md font-bold uppercase tracking-widest mb-2 print:text-black" style={{ color: themeColor }}>{title}</h3>}
        {template === 'Minimal' && <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 print:text-black">{title}</h3>}
    </>
);

const SkillRow = ({ category, skills, template, themeColor }) => (
    <div className="flex items-start gap-2 text-sm">
        <span className="font-bold w-32 flex-shrink-0 text-gray-700">{category}:</span>
        <div className="flex flex-wrap gap-1">
            {skills.map((s, i) => (
                <span key={i} className="text-gray-800">{s}{i < skills.length - 1 ? ',' : ''}</span>
            ))}
        </div>
    </div>
);

export default Preview;
