import type { Meta, StoryObj } from '@storybook/react';
import { CreateProjectScreen } from './index';

const meta: Meta<typeof CreateProjectScreen> = {
  title: 'Onboarding/CreateProjectScreen',
  component: CreateProjectScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof CreateProjectScreen>;

export const Default: Story = {};
