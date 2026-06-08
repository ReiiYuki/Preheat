import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useApp } from '@/modules/core/hooks/useAppState';
import { Input } from '@base-ui/react/input';

export function WelcomeScreen() {
  const { setUser } = useApp();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      setUser(trimmed);
      navigate({ to: '/create-project' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[--color-bg]">
      <div className="max-w-[480px] w-full p-12 text-center animate-fade-in">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Preheat Logo" className="w-16 h-16 mx-auto mb-6 object-contain" />
        <h1 className="text-[2rem] font-semibold text-[--color-text] m-0 mb-2">Preheat</h1>
        <p className="text-base font-medium text-[--color-text] m-0 mb-2">Don’t wait. Warm the prompt.</p>
        <p className="text-base text-[--color-text-secondary] m-0 mb-8">What should we call you?</p>
        
        <form onSubmit={handleSubmit}>
          <Input 
            className="w-full border border-[--color-border] rounded-lg py-3 px-4 text-base outline-none transition-colors bg-[--color-bg] text-[--color-text] box-border font-inherit focus:border-[--color-accent]"
            placeholder="e.g. John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button 
            type="submit" 
            className="w-full bg-[--color-text] text-[--color-bg] border-none rounded-lg p-3 text-base font-medium cursor-pointer mt-4 transition-opacity font-inherit disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={!name.trim()}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
