import { useCallback, useRef } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = prompt('URL:', previousUrl ?? '');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = prompt('Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [editor]);

  return (
    <BubbleMenu editor={editor} className="flex items-center gap-[2px] bg-[--color-text] px-2 py-1 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('bold') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('italic') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('strike') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </button>

      <div className="w-[1px] h-4 bg-[rgba(255,255,255,0.2)] mx-1" />

      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('heading', { level: 1 }) ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        H₁
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('heading', { level: 2 }) ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        H₂
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('heading', { level: 3 }) ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        H₃
      </button>

      <div className="w-[1px] h-4 bg-[rgba(255,255,255,0.2)] mx-1" />

      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('bulletList') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        •
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('orderedList') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered list"
      >
        1.
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('taskList') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="Task list"
      >
        ☐
      </button>
      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('blockquote') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        ❝
      </button>

      <div className="w-[1px] h-4 bg-[rgba(255,255,255,0.2)] mx-1" />

      <button
        className={`bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)] ${editor.isActive('link') ? 'bg-[rgba(255,255,255,0.25)]' : ''}`}
        onClick={setLink}
        title="Link"
      >
        🔗
      </button>
      <button
        className="bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)]"
        onClick={addImage}
        title="Add image by URL"
      >
        🖼️
      </button>
      <button
        className="bg-transparent border-none text-[--color-bg] cursor-pointer px-2 py-1 rounded text-[13px] transition-colors leading-none font-inherit hover:bg-[rgba(255,255,255,0.15)]"
        onClick={() => fileInputRef.current?.click()}
        title="Upload image"
      >
        📁
      </button>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={uploadImage}
        accept="image/*"
        className="hidden"
      />
    </BubbleMenu>
  );
}
