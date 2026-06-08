import type { Meta, StoryObj } from '@storybook/react';
import { EditorToolbar } from './index';
import type { Editor } from '@tiptap/react';

const meta: Meta<typeof EditorToolbar> = {
  title: 'Editor/EditorToolbar',
  component: EditorToolbar,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditorToolbar>;

export const Default: Story = {
  args: {
    editor: {
      isActive: () => false,
      chain: () => ({ focus: () => ({ toggleBold: () => ({ run: () => {} }), toggleItalic: () => ({ run: () => {} }), toggleStrike: () => ({ run: () => {} }), toggleHeading: () => ({ run: () => {} }), toggleBulletList: () => ({ run: () => {} }), toggleOrderedList: () => ({ run: () => {} }), toggleTaskList: () => ({ run: () => {} }), toggleBlockquote: () => ({ run: () => {} }), setLink: () => ({ run: () => {} }), extendMarkRange: () => ({ unsetLink: () => ({ run: () => {} }), setLink: () => ({ run: () => {} }) }) }) }),
      getAttributes: () => ({ href: '' })
    } as unknown as Editor,
  }
};
