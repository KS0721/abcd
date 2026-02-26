import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import { useUIStore } from '../../store/useUIStore';

function OpenConfirmWrapper() {
  const showConfirm = useUIStore((s) => s.showConfirm);
  useEffect(() => {
    showConfirm('모든 데이터를 초기화하시겠습니까?');
  }, [showConfirm]);
  return <ConfirmModal />;
}

const meta: Meta = {
  title: 'Modals/ConfirmModal',
  component: ConfirmModal,
};

export default meta;
type Story = StoryObj;

export const Closed: Story = {};

export const Open: Story = {
  render: () => <OpenConfirmWrapper />,
};
