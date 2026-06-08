import { useState, useEffect } from 'react';
import { Sidebar } from '@/modules/dashboard/components/Sidebar';
import { Editor } from '@/modules/editor/components/Editor';
import { ActionButtons } from '@/modules/editor/components/ActionButtons';

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[--color-bg]">
      {/* Sidebar with mobile overlay */}
      <div 
        className={`fixed md:relative z-[60] h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'}`}
      >
        <Sidebar onCloseMobile={() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }} />
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-[50] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        {!isSidebarOpen && (
          <button 
            className="absolute top-4 left-4 z-40 p-2 bg-transparent border-none text-[--color-text-tertiary] hover:text-[--color-text] cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
            title="Open Sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <Editor />
        <ActionButtons />
      </div>
    </div>
  );
}
