import type { Meta, StoryObj } from '@storybook/react';
import { ActionButtons } from './index';

const meta: Meta<typeof ActionButtons> = {
  title: 'Editor/ActionButtons',
  component: ActionButtons,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const Default: Story = {};
