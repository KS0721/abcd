import type { Meta, StoryObj } from '@storybook/react';
import TabBar from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Layout/TabBar',
  component: TabBar,
};

export default meta;
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {};
