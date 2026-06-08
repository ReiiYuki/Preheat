import { Sidebar } from '@/modules/dashboard/components/Sidebar';
import { Editor } from '@/modules/editor/components/Editor';
import { ActionButtons } from '@/modules/editor/components/ActionButtons';

export function Dashboard() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Editor />
        <ActionButtons />
      </div>
    </div>
  );
}
