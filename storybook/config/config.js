/* eslint-env node */

import { setOptions } from '@storybook/addon-options';
import { configure } from '@storybook/react';

setOptions({
  theme: {
    brandTitle: 'Instana'
  }
});

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
