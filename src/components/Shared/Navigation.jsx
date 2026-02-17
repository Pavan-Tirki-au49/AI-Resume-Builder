import React, { useState } from 'react';
import { Home, FileText, CheckCircle, Smartphone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]';
    };

    return (
        <nav className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between px-6 sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-shadow">
                    RB
                </div>
                <span className="font-bold text-lg tracking-tight">AI Resume Builder</span>
            </Link>

            <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-color)]">
                <NavLink to="/builder" icon={<FileText size={18} />} label="Builder" active={location.pathname === '/builder'} />
                <NavLink to="/preview" icon={<Smartphone size={18} />} label="Preview" active={location.pathname === '/preview'} />
                <NavLink to="/proof" icon={<CheckCircle size={18} />} label="Proof" active={location.pathname === '/proof'} />
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500"></div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${active ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'}`}
    >
        {icon}
        {label}
    </Link>
);

export default Navigation;
