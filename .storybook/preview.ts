import type { Preview } from '@storybook/react';
import '../src/ui/styles/variables.css';
import '../src/ui/styles/reset.css';
import '../src/ui/styles/global.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
