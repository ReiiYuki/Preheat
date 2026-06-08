import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { CommandList, type CommandItem } from '@/modules/editor/components/CommandList';

export function getSuggestionOptions() {
  return {
    items: ({ query }: { query: string }): CommandItem[] => {
      return [
        {
          title: 'Heading 1',
          icon: 'H1',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
          },
        },
        {
          title: 'Heading 2',
          icon: 'H2',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
          },
        },
        {
          title: 'Heading 3',
          icon: 'H3',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
          },
        },
        {
          title: 'Bullet List',
          icon: '•',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
          },
        },
        {
          title: 'Numbered List',
          icon: '1.',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
          },
        },
        {
          title: 'Task List',
          icon: '☐',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
          },
        },
        {
          title: 'Code Block',
          icon: '</>',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
          },
        },
        {
          title: 'Blockquote',
          icon: '❝',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
          },
        },
        {
          title: 'Image',
          icon: '🖼️',
          command: ({ editor, range }: { editor: any; range: any }) => {
            editor.chain().focus().deleteRange(range).run();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  editor.chain().focus().setImage({ src: reader.result as string }).run();
                };
              }
            };
            input.click();
          },
        },
      ].filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
    },

    render: () => {
      let component: ReactRenderer<any>;
      let popup: any[];

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(CommandList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props: any) {
          component.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }

          return component.ref?.onKeyDown(props);
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}
