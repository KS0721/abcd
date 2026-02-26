import type { Meta, StoryObj } from '@storybook/react';
import ErrorBoundary from './ErrorBoundary';

function ThrowError(): never {
  throw new Error('테스트 에러');
}

function NormalChild() {
  return <div style={{ padding: '2rem', textAlign: 'center' }}>정상 콘텐츠</div>;
}

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Layout/ErrorBoundary',
  component: ErrorBoundary,
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Normal: Story = {
  args: { children: <NormalChild /> },
};

export const WithError: Story = {
  args: { children: <ThrowError /> },
};
