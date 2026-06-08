import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useApp } from '@/modules/core/hooks/useAppState';
import { Input } from '@base-ui/react/input';

export function CreateProjectScreen() {
  const { addProject } = useApp();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      addProject(trimmed);
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[--color-bg]">
      <div className="max-w-[480px] w-full p-12 text-center animate-fade-in">
        <h1 className="text-[2rem] font-semibold text-[--color-text] m-0 mb-2">Create New Project</h1>
        <p className="text-base text-[--color-text-secondary] m-0 mb-8">What are you working on next?</p>
        
        <form onSubmit={handleSubmit}>
          <Input 
            className="w-full border border-[--color-border] rounded-[24px] py-3 px-5 text-base outline-none transition-colors bg-[--color-bg] text-[--color-text] box-border font-inherit focus:border-[--color-accent]"
            placeholder="e.g. Website Redesign" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button 
            type="submit" 
            className="btn-primary w-full rounded-[24px] p-3 text-base font-medium cursor-pointer mt-4 transition-opacity font-inherit disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
