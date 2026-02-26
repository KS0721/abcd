import type { Meta, StoryObj } from '@storybook/react';
import EmergencyBar from './EmergencyBar';

const meta: Meta<typeof EmergencyBar> = {
  title: 'Cards/EmergencyBar',
  component: EmergencyBar,
};

export default meta;
type Story = StoryObj<typeof EmergencyBar>;

export const Default: Story = {};
