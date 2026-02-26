import type { Meta, StoryObj } from '@storybook/react';
import CardGrid from './CardGrid';

const meta: Meta<typeof CardGrid> = {
  title: 'Cards/CardGrid',
  component: CardGrid,
};

export default meta;
type Story = StoryObj<typeof CardGrid>;

export const Default: Story = {};
