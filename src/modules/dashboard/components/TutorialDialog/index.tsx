import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useApp } from '@/modules/core/hooks/useAppState';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorialDialog({ open, onOpenChange }: TutorialDialogProps) {
  const { markTutorialSeen } = useApp();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Preheat',
      content: 'Preheat helps you prepare your thoughts before jumping into work. Don\'t wait. Warm the prompt.',
    },
    {
      title: 'Slash Commands',
      content: 'Type "/" in the editor to quickly insert headings, bullet points, checklists, and more without taking your hands off the keyboard.',
    },
    {
      title: 'Bi-directional Linking',
      content: 'Type "[[" to instantly link to other plans or create new ones on the fly. It helps you connect your thoughts seamlessly.',
    },
    {
      title: 'Privacy First',
      content: 'All your data is stored locally in your browser and works offline. You can also run Preheat as a native desktop app.',
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    markTutorialSeen();
    setStep(0); // Reset for next time
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else onOpenChange(true);
    }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-[100]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[--color-bg] rounded-[24px] p-10 min-w-[480px] shadow-lg z-[101]">
          
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold text-[--color-text]">
              {steps[step].title}
            </Dialog.Title>
            <div className="text-[11px] text-[--color-text-tertiary] font-bold tracking-widest uppercase bg-[--color-surface] px-3 py-1 rounded-full">
              Step {step + 1} of {steps.length}
            </div>
          </div>

          <Dialog.Description className="text-sm text-[--color-text-secondary] mb-8 leading-relaxed min-h-[60px]">
            {steps[step].content}
          </Dialog.Description>
          
          <div className="flex gap-4 justify-between items-center mt-6">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[var(--gradient-primary)] w-4' : 'bg-[--color-border]'}`}
                  style={i === step ? { background: 'var(--gradient-primary)' } : {}}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {step > 0 && (
                <button 
                  className="px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer border border-[--color-border] bg-[--color-bg] text-[--color-text] transition-colors hover:bg-[--color-surface]"
                  onClick={handlePrev}
                >
                  Back
                </button>
              )}
              <button 
                className="btn-primary px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer transition-opacity"
                onClick={handleNext}
              >
                {step === steps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
          
          <Dialog.Close className="absolute top-4 right-4 text-[--color-text-tertiary] hover:text-[--color-text] transition-colors">
            ✕
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
