import type { Meta, StoryObj } from '@storybook/react';
import { CommandList } from './index';

const meta: Meta<typeof CommandList> = {
  title: 'Editor/CommandList',
  component: CommandList,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CommandList>;

export const Default: Story = {
  args: {
    items: [
      { title: 'Heading 1', icon: 'H1' },
      { title: 'Heading 2', icon: 'H2' },
      { title: 'Bullet List', icon: '•' },
    ],
    command: () => {},
  }
};
