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
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[--color-bg] rounded-xl p-8 min-w-[400px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[101]">
          
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold text-[--color-text]">
              {steps[step].title}
            </Dialog.Title>
            <div className="text-xs text-[--color-text-tertiary] font-medium tracking-widest uppercase">
              Step {step + 1} of {steps.length}
            </div>
          </div>

          <Dialog.Description className="text-sm text-[--color-text-secondary] mb-8 leading-relaxed min-h-[60px]">
            {steps[step].content}
          </Dialog.Description>
          
          <div className="flex gap-3 justify-between items-center mt-4">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-[--color-accent]' : 'bg-[--color-border]'}`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {step > 0 && (
                <button 
                  className="px-4 py-1.5 rounded-md text-[13px] font-inherit cursor-pointer border border-[--color-border] bg-[--color-bg] text-[--color-text] transition-colors hover:bg-[--color-hover]"
                  onClick={handlePrev}
                >
                  Back
                </button>
              )}
              <button 
                className="px-4 py-1.5 rounded-md text-[13px] font-inherit cursor-pointer border border-[--color-text] bg-[--color-text] text-[--color-bg] transition-colors hover:opacity-90"
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
