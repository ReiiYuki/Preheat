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
    },
    {
      title: 'Local MCP Server',
      content: 'Using the native desktop app, you can enable the Local MCP Server. This allows external AI agents to read and edit your Preheat plans directly!',
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
    onOpenChange(false);
    setStep(0);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-[100]" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[--color-bg] rounded-[24px] p-8 w-[90%] max-w-[480px] shadow-lg z-[101]">
          
          <Dialog.Title className="text-xl font-bold mb-4 text-[--color-text]">
            {steps[step].title}
          </Dialog.Title>

          <Dialog.Description className="text-base text-[--color-text-secondary] mb-8 leading-relaxed min-h-[80px]">
            {steps[step].content}
          </Dialog.Description>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
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
                  className="px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer border border-[--color-border] bg-[--color-surface] text-[--color-text] transition-colors hover:bg-[--color-hover] shadow-sm font-medium"
                  onClick={handlePrev}
                >
                  Back
                </button>
              )}
              <button 
                className="btn-primary px-5 py-2 rounded-[16px] text-[13px] font-inherit cursor-pointer transition-opacity font-medium"
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
