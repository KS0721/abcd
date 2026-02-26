import type { Meta, StoryObj } from '@storybook/react';
import OutputBar from './OutputBar';

const meta: Meta<typeof OutputBar> = {
  title: 'Layout/OutputBar',
  component: OutputBar,
};

export default meta;
type Story = StoryObj<typeof OutputBar>;

export const Default: Story = {};
