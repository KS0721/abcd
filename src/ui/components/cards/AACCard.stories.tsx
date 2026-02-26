import type { Meta, StoryObj } from '@storybook/react';
import AACCard from './AACCard';
import type { Card } from '../../../domains/card/models';

const sampleCard: Card = {
  id: 'sample1',
  text: '물',
  category: 'food',
  arasaacKeyword: '물',
  grammarType: 'noun',
};

const emergencyCard: Card = {
  id: 'emergency1',
  text: '도와주세요',
  category: 'emergency',
  emergency: true,
};

const userCard: Card = {
  id: 'user1',
  text: '커스텀 카드',
  category: 'thing',
  isUserCard: true,
};

const meta: Meta<typeof AACCard> = {
  title: 'Cards/AACCard',
  component: AACCard,
  args: {
    card: sampleCard,
    isSelected: false,
    isEditMode: false,
    onSelect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AACCard>;

export const Default: Story = {};

export const Selected: Story = {
  args: { isSelected: true },
};

export const Emergency: Story = {
  args: { card: emergencyCard },
};

export const EditMode: Story = {
  args: {
    card: userCard,
    isEditMode: true,
    onDelete: () => {},
    onEdit: () => {},
  },
};
