import type { Meta, StoryObj } from '@storybook/react';
import CategoryBar from './CategoryBar';

const meta: Meta<typeof CategoryBar> = {
  title: 'Cards/CategoryBar',
  component: CategoryBar,
};

export default meta;
type Story = StoryObj<typeof CategoryBar>;

export const Default: Story = {};
