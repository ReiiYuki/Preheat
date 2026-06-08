import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeScreen } from './index';

const meta: Meta<typeof WelcomeScreen> = {
  title: 'Onboarding/WelcomeScreen',
  component: WelcomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WelcomeScreen>;

export const Default: Story = {};
