import { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useApp } from '@/modules/core/hooks/useAppState';
import { useDebounce } from '@/modules/core/hooks/useDebounce';
import { EditorToolbar } from '@/modules/editor/components/EditorToolbar';
import { SlashCommand } from '@/modules/editor/utils/SlashCommand';

export function Editor() {
  const { state, updatePlanTitle, updatePlanContent } = useApp();

  // Find the active plan across all projects
  const activePlan = state.projects
    .flatMap((p) => p.plans)
    .find((plan) => plan.id === state.activePlanId) ?? null;

  const activePlanIdRef = useRef(state.activePlanId);
  activePlanIdRef.current = state.activePlanId;

  const editor = useEditor({
    extensions: [
      StarterKit,
      SlashCommand,
      Placeholder.configure({
        placeholder: "Start writing, or press '/' for commands...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
    ],
    content: activePlan?.content ?? '',
    onUpdate: ({ editor: e }) => {
      debouncedUpdate(e.getHTML());
    },
    editorProps: {
      handleDrop: function(view, event, _slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              const node = schema.nodes.image.create({ src: reader.result });
              if (coordinates) {
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            };
            return true;
          }
        }
        return false;
      },
      handlePaste: function(view, event, _slice) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        
        let handled = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf("image") === 0) {
            const file = item.getAsFile();
            if (!file) continue;
            
            event.preventDefault();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              const { schema } = view.state;
              const node = schema.nodes.image.create({ src: reader.result });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            };
            handled = true;
          }
        }
        return handled;
      }
    }
  });

  const saveContent = useCallback(
    (html: string) => {
      const planId = activePlanIdRef.current;
      if (planId) {
        updatePlanContent(planId, html);
      }
    },
    [updatePlanContent],
  );

  const debouncedUpdate = useDebounce(saveContent, 300);

  // Sync editor content when the active plan changes
  useEffect(() => {
    if (editor && activePlan) {
      // Only update if the content actually differs to avoid cursor jumps
      const currentContent = editor.getHTML();
      if (currentContent !== activePlan.content) {
        editor.commands.setContent(activePlan.content || '');
      }
    } else if (editor && !activePlan) {
      editor.commands.setContent('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activePlanId, editor]);


  if (!activePlan) {
    return (
      <div className="flex-1 flex flex-col overflow-y-auto bg-[--color-bg]">
        <div className="flex-1 flex items-center justify-center text-[--color-text-tertiary] text-sm">
          Select a plan from the sidebar or create a new one.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[--color-bg]">
      <div className="max-w-[720px] w-full mx-auto px-6 py-12">
        <input
          className="w-full border-none outline-none text-[2rem] font-bold text-[--color-text] bg-transparent mb-6 font-inherit placeholder-[--color-text-tertiary]"
          value={activePlan.title}
          onChange={(e) => updatePlanTitle(activePlan.id, e.target.value)}
          placeholder="Plan Title"
        />
        {editor && <EditorToolbar editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
