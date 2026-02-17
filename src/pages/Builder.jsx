import React, { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Code, AlertCircle, CheckCircle, Zap, LayoutTemplate, Plus, X, ChevronDown, ChevronUp, Loader2, Link as LinkIcon, Github, Palette, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Builder = () => {
    const navigate = useNavigate();

    // Initial state with new structure
    const initialData = {
        personal: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: {
            technical: [],
            soft: [],
            tools: []
        },
        links: { github: '', linkedin: '' }
    };

    const [resumeData, setResumeData] = useState(initialData);
    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [template, setTemplate] = useState('Classic');
    const [themeColor, setThemeColor] = useState('hsl(168, 60%, 40%)'); // Default Teal
    const [isSuggesting, setIsSuggesting] = useState(false);

    const colors = [
        { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
        { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
        { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
        { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
        { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' }
    ];

    const templates = [
        { name: 'Classic', desc: 'Timeless & Professional', preview: 'border-t-4 border-gray-800' },
        { name: 'Modern', desc: 'Bold & Creative', preview: 'border-l-4 border-blue-600' },
        { name: 'Minimal', desc: 'Clean & Simple', preview: 'border border-gray-200' }
    ];

    // Initial Load & Migration
    useEffect(() => {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Simple migration check for old skills string
                if (typeof parsed.skills === 'string') {
                    parsed.skills = { technical: parsed.skills.split(',').filter(s => s), soft: [], tools: [] };
                }
                // Migration for old projects
                if (parsed.projects && parsed.projects.length > 0 && !parsed.projects[0].techStack) {
                    parsed.projects = parsed.projects.map(p => ({ ...p, techStack: [], liveUrl: '', githubUrl: '', isOpen: false }));
                }
                setResumeData({ ...initialData, ...parsed });
            } catch (e) {
                console.error("Data migration failed", e);
            }
        }
        const savedTemplate = localStorage.getItem('resumeBuilderTemplate');
        if (savedTemplate) setTemplate(savedTemplate);

        const savedColor = localStorage.getItem('resumeBuilderColor');
        if (savedColor) setThemeColor(savedColor);
    }, []);

    // Persistence
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
        calculateScore(resumeData);
    }, [resumeData]);

    useEffect(() => {
        localStorage.setItem('resumeBuilderTemplate', template);
    }, [template]);

    useEffect(() => {
        localStorage.setItem('resumeBuilderColor', themeColor);
    }, [themeColor]);

    // ATS Logic Updated (Deterministic)
    const calculateScore = (data) => {
        let score = 0;
        let suggs = [];

        // 1. Name (+10)
        if (data.personal.name && data.personal.name.trim().length > 0) score += 10;
        else suggs.push("Add your full name (+10)");

        // 2. Email (+10)
        if (data.personal.email && /\S+@\S+\.\S+/.test(data.personal.email)) score += 10;
        else suggs.push("Add a valid email (+10)");

        // 3. Summary > 50 chars (+10)
        if (data.summary && data.summary.length > 50) score += 10;
        else suggs.push("Expand summary > 50 chars (+10)");

        // 4. Experience with bullets/content (+15)
        if (data.experience.length > 0 && data.experience.some(e => e.description && e.description.trim().length > 10)) score += 15;
        else suggs.push("Add experience with details (+15)");

        // 5. Education (+10)
        if (data.education.length >= 1) score += 10;
        else suggs.push("Add education (+10)");

        // 6. Skills >= 5 (+10)
        const totalSkills = data.skills.technical.length + data.skills.soft.length + data.skills.tools.length;
        if (totalSkills >= 5) score += 10;
        else suggs.push("Add at least 5 skills (+10)");

        // 7. Projects >= 1 (+10)
        if (data.projects.length >= 1) score += 10;
        else suggs.push("Add a project (+10)");

        // 8. Phone (+5)
        if (data.personal.phone) score += 5;
        else suggs.push("Add phone number (+5)");

        // 9. LinkedIn (+5)
        if (data.links.linkedin) score += 5;
        else suggs.push("Add LinkedIn profile (+5)");

        // 10. GitHub (+5)
        if (data.links.github) score += 5;
        else suggs.push("Add GitHub profile (+5)");

        // 11. Action Verbs in Summary (+10)
        const actionVerbs = ['built', 'led', 'designed', 'improved', 'developed', 'managed', 'created', 'initiated', 'engineered', 'implemented', 'orchestrated'];
        const summaryLower = (data.summary || '').toLowerCase();
        if (actionVerbs.some(v => summaryLower.includes(v))) score += 10;
        else suggs.push("Use action verbs in summary (+10)");

        setAtsScore(Math.min(100, score));
        setSuggestions(suggs);
    };

    // --- Actions ---

    const handleSuggestSkills = () => {
        setIsSuggesting(true);
        setTimeout(() => {
            setResumeData(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggesting(false);
        }, 1000);
    };

    const addSkill = (category, skill) => {
        if (!skill) return;
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...prev.skills[category], skill]
            }
        }));
    };

    const removeSkill = (category, index) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter((_, i) => i !== index)
            }
        }));
    };

    // Project Actions
    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', isOpen: true }]
        }));
    };

    const updateProject = (index, field, value) => {
        setResumeData(prev => {
            const newProjs = [...prev.projects];
            newProjs[index] = { ...newProjs[index], [field]: value };
            return { ...prev, projects: newProjs };
        });
    };

    const toggleProject = (index) => {
        setResumeData(prev => {
            const newProjs = [...prev.projects];
            newProjs[index] = { ...newProjs[index], isOpen: !newProjs[index].isOpen };
            return { ...prev, projects: newProjs };
        });
    };

    const removeProject = (index) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const addProjectTech = (index, tech) => {
        if (!tech) return;
        setResumeData(prev => {
            const newProjs = [...prev.projects];
            newProjs[index].techStack = [...(newProjs[index].techStack || []), tech];
            return { ...prev, projects: newProjs };
        });
    };

    const removeProjectTech = (pIndex, tIndex) => {
        setResumeData(prev => {
            const newProjs = [...prev.projects];
            newProjs[pIndex].techStack = newProjs[pIndex].techStack.filter((_, i) => i !== tIndex);
            return { ...prev, projects: newProjs };
        });
    };

    // Generic Change Handler (Personal, Links, Summary)
    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section === 'personal' || section === 'links') {
            setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
        } else {
            setResumeData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Education Handlers
    const addEducation = () => setResumeData(prev => ({ ...prev, education: [...prev.education, { institution: '', degree: '', year: '' }] }));
    const updateEducation = (idx, field, val) => {
        const newEdu = [...resumeData.education];
        newEdu[idx][field] = val;
        setResumeData({ ...resumeData, education: newEdu });
    };
    const removeEducation = (idx) => setResumeData({ ...resumeData, education: resumeData.education.filter((_, i) => i !== idx) });

    // Experience Handlers
    const addExperience = () => setResumeData(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }] }));
    const updateExperience = (idx, field, val) => {
        const newExp = [...resumeData.experience];
        newExp[idx][field] = val;
        setResumeData({ ...resumeData, experience: newExp });
    };
    const removeExperience = (idx) => setResumeData({ ...resumeData, experience: resumeData.experience.filter((_, i) => i !== idx) });


    const checkBullet = (text) => {
        if (!text) return null;
        if (!/^(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated)/i.test(text.trim())) return "Start with a strong action verb.";
        if (!/\d+|%|k\b/i.test(text)) return "Add measurable impact (numbers).";
        return null;
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[var(--bg-primary)]">

            {/* --- Left Panel: Forms --- */}
            <div className="w-1/2 overflow-y-auto p-8 border-r border-[var(--border-color)] space-y-8 custom-scrollbar relative">

                {/* Header & Sample Data */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">Edit Your Resume</h2>
                </div>

                {/* Templates & ATS Score Sticky Panel */}
                <div className="sticky top-0 z-10 space-y-4">

                    {/* ATS Score Card */}
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 shadow-xl glass">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">ATS Readiness Score</span>
                            <span className={`text-xl font-black ${atsScore >= 80 ? 'text-[var(--success)]' : atsScore >= 50 ? 'text-yellow-400' : 'text-[var(--error)]'}`}>{atsScore}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden mb-3">
                            <div className={`h-full transition-all duration-500 rounded-full ${atsScore >= 80 ? 'bg-[var(--success)]' : atsScore >= 50 ? 'bg-yellow-400' : 'bg-[var(--error)]'}`} style={{ width: `${atsScore}%` }}></div>
                        </div>
                        {suggestions.length > 0 ? (
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Top improvements</span>
                                {suggestions.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]"><AlertCircle size={10} className="text-yellow-500 flex-shrink-0" /> {s}</div>
                                ))}
                            </div>
                        ) : atsScore > 0 && <div className="flex items-center gap-2 text-[10px] text-[var(--success)]"><CheckCircle size={10} /> Strong Resume!</div>}
                    </div>
                </div>

                {/* Personal Info */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[var(--accent-secondary)] font-semibold mb-2"><User size={18} /> Personal Info</div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Full Name" name="name" value={resumeData.personal.name} onChange={(e) => handleChange(e, 'personal')} placeholder="Jane Doe" />
                        <InputGroup label="Email" name="email" value={resumeData.personal.email} onChange={(e) => handleChange(e, 'personal')} placeholder="jane@example.com" />
                        <InputGroup label="Phone" name="phone" value={resumeData.personal.phone} onChange={(e) => handleChange(e, 'personal')} placeholder="(555) 555-5555" />
                        <InputGroup label="Location" name="location" value={resumeData.personal.location} onChange={(e) => handleChange(e, 'personal')} placeholder="New York, NY" />
                    </div>
                </section>

                {/* Social Links */}
                <section className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold mb-2">Links</div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="GitHub" name="github" value={resumeData.links.github} onChange={(e) => handleChange(e, 'links')} placeholder="github.com/username" />
                        <InputGroup label="LinkedIn" name="linkedin" value={resumeData.links.linkedin} onChange={(e) => handleChange(e, 'links')} placeholder="linkedin.com/in/username" />
                    </div>
                </section>

                {/* Summary */}
                <section className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold mb-2">Summary</div>
                    <textarea className="w-full h-32 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none" value={resumeData.summary} name="summary" onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder="Professional summary..."></textarea>
                    <p className="text-[10px] text-[var(--text-secondary)] text-right">{resumeData.summary.length > 0 ? resumeData.summary.trim().split(/\s+/).length : 0} words (Target: 40-120)</p>
                </section>

                {/* Skills Section (Updated) */}
                <section className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-[var(--accent-primary)] font-semibold"><Code size={18} /> Skills</div>
                        <button onClick={handleSuggestSkills} disabled={isSuggesting} className="flex items-center gap-1 text-xs px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full hover:bg-[var(--accent-primary)]/20 transition-colors">
                            {isSuggesting ? <Loader2 size={12} className="animate-spin" /> : '✨ Suggest Skills'}
                        </button>
                    </div>

                    <div className="grid gap-6">
                        <SkillGroup title="Technical Skills" category="technical" skills={resumeData.skills.technical} onAdd={addSkill} onRemove={removeSkill} />
                        <SkillGroup title="Soft Skills" category="soft" skills={resumeData.skills.soft} onAdd={addSkill} onRemove={removeSkill} />
                        <SkillGroup title="Tools & Technologies" category="tools" skills={resumeData.skills.tools} onAdd={addSkill} onRemove={removeSkill} />
                    </div>
                </section>

                {/* Projects Section (Accordion) */}
                <section className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold"><Zap size={18} /> Projects</div>
                        <button onClick={addProject} className="flex items-center gap-1 text-xs text-[var(--accent-primary)] hover:underline"><Plus size={12} /> Add Project</button>
                    </div>

                    <div className="space-y-4">
                        {resumeData.projects.map((proj, idx) => (
                            <div key={idx} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden transition-all">
                                <div className="flex justify-between items-center p-3 cursor-pointer bg-[var(--bg-tertiary)]/30 hover:bg-[var(--bg-tertiary)]/50" onClick={() => toggleProject(idx)}>
                                    <span className="text-sm font-bold truncate">{proj.title || "New Project"}</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); removeProject(idx); }} className="p-1 hover:text-[var(--error)]"><X size={14} /></button>
                                        {proj.isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                {proj.isOpen && (
                                    <div className="p-4 space-y-4">
                                        <InputGroup label="Project Title" value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} placeholder="e.g. AI Workflow Engine" />

                                        <div>
                                            <label className="text-xs font-uppercase text-[var(--text-secondary)] mb-1 block">Description</label>
                                            <textarea className="w-full h-20 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                                                value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value.slice(0, 200))} placeholder="Describe the project..." />
                                            <div className="flex justify-between items-start mt-1">
                                                <span className="text-[10px] text-yellow-500">{checkBullet(proj.description)}</span>
                                                <span className="text-[10px] text-[var(--text-secondary)]">{proj.description.length}/200</span>
                                            </div>
                                        </div>

                                        <TagInput label="Tech Stack" tags={proj.techStack || []} onAdd={(t) => addProjectTech(idx, t)} onRemove={(tIdx) => removeProjectTech(idx, tIdx)} placeholder="Add tech (e.g. React)..." />

                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup label="Live URL" value={proj.liveUrl} onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)} placeholder="https://..." />
                                            <InputGroup label="GitHub URL" value={proj.githubUrl} onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)} placeholder="github.com/..." />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold"><Briefcase size={18} /> Experience</div>
                        <button onClick={addExperience} className="text-xs text-[var(--accent-primary)] hover:underline">+ Add Experience</button>
                    </div>
                    {resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] space-y-2 relative group">
                            <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-[var(--error)] opacity-0 group-hover:opacity-100 transition-opacity text-xs">Remove</button>
                            <div className="grid grid-cols-2 gap-2">
                                <InputGroup label="Title" value={exp.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} placeholder="Senior Engineer" />
                                <InputGroup label="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} placeholder="TechCorp" />
                                <InputGroup label="Duration" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} placeholder="2020 - Present" fullWidth />
                                <div className="col-span-2">
                                    <label className="text-xs font-uppercase text-[var(--text-secondary)] font-medium tracking-wide">Description</label>
                                    <textarea className="w-full h-20 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none mt-1"
                                        value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} placeholder="Did X, achieved Y..." />
                                    {checkBullet(exp.description) && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><Zap size={10} /> {checkBullet(exp.description)}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Education */}
                <section className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] font-semibold"><GraduationCap size={18} /> Education</div>
                        <button onClick={addEducation} className="text-xs text-[var(--accent-primary)] hover:underline">+ Add Education</button>
                    </div>
                    {resumeData.education.map((edu, idx) => (
                        <div key={idx} className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] space-y-2 relative group">
                            <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-[var(--error)] opacity-0 group-hover:opacity-100 transition-opacity text-xs">Remove</button>
                            <div className="grid grid-cols-2 gap-2">
                                <InputGroup label="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} placeholder="University..." />
                                <InputGroup label="Year" value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} placeholder="2020" />
                                <InputGroup label="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} placeholder="BS Computer Science" fullWidth />
                            </div>
                        </div>
                    ))}
                </section>

            </div>

            {/* --- Right Panel: Live Preview --- */}
            <div className="w-1/2 bg-[var(--bg-secondary)] p-8 overflow-y-auto flex flex-col items-center relative">

                {/* Visual Template Switcher & Color Picker */}
                <div className="w-full max-w-[210mm] mb-6 space-y-4">

                    {/* Template Thumbnails */}
                    <div className="grid grid-cols-3 gap-4">
                        {templates.map(t => (
                            <div key={t.name} onClick={() => setTemplate(t.name)}
                                className={`cursor-pointer rounded-xl border-2 transition-all p-2 bg-[var(--bg-primary)] ${template === t.name ? 'border-[var(--accent-primary)] shadow-lg shadow-purple-500/20' : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'}`}>
                                <div className={`aspect-[3/4] rounded-md bg-white mb-2 overflow-hidden relative shadow-inner ${t.name === 'Classic' ? 'p-2' : ''} ${t.name === 'Modern' ? 'flex' : ''}`}>
                                    {/* Thumbnail Sketches */}
                                    {t.name === 'Classic' && (
                                        <div className="space-y-1">
                                            <div className="h-2 w-12 bg-gray-800 rounded mx-auto mb-2"></div>
                                            <div className="h-0.5 w-full bg-gray-200"></div>
                                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                                            <div className="h-1 w-2/3 bg-gray-100 rounded"></div>
                                        </div>
                                    )}
                                    {t.name === 'Modern' && (
                                        <>
                                            <div className="w-1/3 h-full bg-gray-100 border-r border-gray-200"></div>
                                            <div className="w-2/3 p-1 space-y-1">
                                                <div className="h-2 w-10 bg-blue-100 rounded mb-1"></div>
                                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                            </div>
                                        </>
                                    )}
                                    {t.name === 'Minimal' && (
                                        <div className="p-2 space-y-2">
                                            <div className="h-2 w-8 bg-gray-800 rounded"></div>
                                            <div className="space-y-1">
                                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                            </div>
                                        </div>
                                    )}

                                    {template === t.name && (
                                        <div className="absolute inset-0 bg-[var(--accent-primary)]/10 flex items-center justify-center">
                                            <div className="bg-[var(--accent-primary)] text-white rounded-full p-1"><Check size={12} strokeWidth={4} /></div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold text-[var(--text-primary)]">{t.name}</div>
                                    <div className="text-[10px] text-[var(--text-secondary)]">{t.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Color Theme Picker */}
                    <div className="flex justify-center gap-3 bg-[var(--bg-primary)] p-3 rounded-full border border-[var(--border-color)] w-max mx-auto shadow-inner">
                        {colors.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => setThemeColor(c.value)}
                                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${themeColor === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f172a] scale-110' : ''}`}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                {/* The Resume Preview */}
                <div className="resume-paper w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl transform scale-75 origin-top transition-transform duration-300" style={{ '--theme-color': themeColor }}>

                    {/* Header */}
                    {/* Header */}
                    <div className={`${template === 'Classic' ? 'border-b-2 pb-4 mb-4 text-center' : ''} ${template === 'Modern' ? 'flex justify-between items-start border-l-8 pl-6 mb-8 py-2' : ''} ${template === 'Minimal' ? 'pb-4 mb-6 text-left border-b border-gray-200' : ''}`}
                        style={{ borderColor: template === 'Modern' || template === 'Classic' ? themeColor : undefined }}>

                        <div className={template === 'Modern' ? 'text-left w-full' : ''}>
                            <h1 className={`${template === 'Classic' ? 'text-4xl font-bold uppercase tracking-wider' : ''} ${template === 'Modern' ? 'text-6xl font-black tracking-tighter leading-none mb-2' : ''} ${template === 'Minimal' ? 'text-3xl font-light tracking-wide text-gray-800' : ''}`}
                                style={{ color: template === 'Modern' ? themeColor : undefined }}>
                                {resumeData.personal.name || 'Your Name'}
                            </h1>

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
                                    <div className={`flex flex-wrap gap-3 text-sm text-gray-600 mt-2 ${template === 'Classic' ? 'justify-center' : ''}`}>
                                        {resumeData.personal.location && <span>{resumeData.personal.location}</span>}
                                        {resumeData.personal.email && <span>• {resumeData.personal.email}</span>}
                                        {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                                    </div>
                                    <div className={`flex gap-3 text-sm mt-1 ${template === 'Classic' ? 'justify-center text-gray-600' : ''} ${template === 'Minimal' ? 'text-gray-500 italic' : ''}`}>
                                        {resumeData.links.linkedin && <span className="underline">{resumeData.links.linkedin}</span>}
                                        {resumeData.links.github && <span className="underline">{resumeData.links.github}</span>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                        <div className="mb-6">
                            <SectionHeader template={template} title={template === 'Modern' ? 'Professional Profile' : 'Summary'} themeColor={themeColor} />
                            <p className="text-sm leading-relaxed text-gray-800">{resumeData.summary}</p>
                        </div>
                    )}

                    {/* Skills (New Grouped Display) */}
                    {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.tools.length > 0) && (
                        <div className="mb-6">
                            <SectionHeader template={template} title="Skills" themeColor={themeColor} />
                            <div className="grid grid-cols-1 gap-2">
                                {resumeData.skills.technical.length > 0 && <SkillRow category="Technical" skills={resumeData.skills.technical} template={template} themeColor={themeColor} />}
                                {resumeData.skills.tools.length > 0 && <SkillRow category="Tools" skills={resumeData.skills.tools} template={template} themeColor={themeColor} />}
                                {resumeData.skills.soft.length > 0 && <SkillRow category="Soft Skills" skills={resumeData.skills.soft} template={template} themeColor={themeColor} />}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                        <div className="mb-6">
                            <SectionHeader template={template} title="Experience" themeColor={themeColor} />
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} className="mb-3">
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

                    {/* Projects (New Card Display) */}
                    {resumeData.projects.length > 0 && (
                        <div className="mb-6">
                            <SectionHeader template={template} title="Projects" themeColor={themeColor} />
                            <div className="space-y-4">
                                {resumeData.projects.map((proj, i) => (
                                    <div key={i} className={`mb-3 ${template === 'Modern' ? 'p-3 bg-gray-50 border-l-4' : ''}`} style={{ borderColor: template === 'Modern' ? themeColor : undefined }}>
                                        <div className="flex justify-between items-baseline">
                                            <span className={`font-bold text-sm ${template === 'Modern' ? 'text-gray-900' : ''}`}>{proj.title}</span>
                                            <div className="flex gap-2 text-xs">
                                                {proj.liveUrl && <span className="underline" style={{ color: themeColor }}>Live Demo</span>}
                                                {proj.githubUrl && <span className="text-gray-600 underline">Code</span>}
                                            </div>
                                        </div>
                                        {proj.description && <p className="text-sm text-gray-800 leading-relaxed mt-1">{proj.description}</p>}
                                        {proj.techStack && proj.techStack.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {proj.techStack.map((t, ti) => (
                                                    <span key={ti} className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded rounded-md border border-gray-300">{t}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                        <div className="mb-6">
                            <SectionHeader template={template} title="Education" themeColor={themeColor} />
                            {resumeData.education.map((edu, i) => (
                                <div key={i} className="mb-2">
                                    <div className="flex justify-between font-bold text-sm"><span>{edu.institution}</span><span>{edu.year}</span></div>
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

// --- Subcomponents ---

const InputGroup = ({ label, name, value, onChange, placeholder, fullWidth }) => (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'col-span-2' : ''}`}>
        <label className="text-xs font-uppercase text-[var(--text-secondary)] font-medium tracking-wide">{label}</label>
        <input type="text" name={name} value={value} onChange={onChange} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-secondary)]/30" placeholder={placeholder} />
    </div>
);

const SkillGroup = ({ title, category, skills, onAdd, onRemove }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--text-secondary)] flex justify-between">
            {title} <span className="opacity-50">({skills.length})</span>
        </label>
        <TagInput tags={skills} onAdd={(t) => onAdd(category, t)} onRemove={(idx) => onRemove(category, idx)} placeholder={`Add ${title}...`} />
    </div>
);

const TagInput = ({ label, tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-uppercase text-[var(--text-secondary)] font-medium tracking-wide">{label}</label>}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-2 flex flex-wrap gap-2 focus-within:border-[var(--accent-primary)] transition-colors">
                {tags.map((tag, idx) => (
                    <span key={idx} className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {tag} <button onClick={() => onRemove(idx)} className="hover:text-[var(--error)]"><X size={10} /></button>
                    </span>
                ))}
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none text-sm text-[var(--text-primary)] flex-1 min-w-[100px]" placeholder={placeholder} />
            </div>
        </div>
    );
};

const SectionHeader = ({ template, title, themeColor }) => (
    <>
        {template === 'Classic' && <h3 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">{title}</h3>}
        {template === 'Modern' && <h3 className="text-md font-bold uppercase tracking-widest mb-2" style={{ color: themeColor }}>{title}</h3>}
        {template === 'Minimal' && <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{title}</h3>}
    </>
);

const SkillRow = ({ category, skills, template, themeColor }) => (
    <div className="flex items-start gap-2 text-sm">
        <span className="font-bold w-32 flex-shrink-0 text-gray-700">{category}:</span>
        <div className="flex flex-wrap gap-1">
            {skills.map((s, i) => (
                template === 'Modern'
                    ? <span key={i} className="px-2 py-0.5 bg-gray-50 rounded text-xs font-medium border" style={{ color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}10` }}>{s}</span>
                    : <span key={i} className="text-gray-800">{s}{i < skills.length - 1 ? ',' : ''}</span>
            ))}
        </div>
    </div>
);

export default Builder;
