/* eslint-env node */
import React from 'react';

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { configure, addDecorator } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { create } from '@storybook/theming';

import 'in-themes/foundation.less';

import locals from './config.mless';

addDecorator(story => <div className={locals.root}>{story()}</div>);

addParameters({
  options: {
    theme: create({
      brandTitle: 'Instana'
    })
  },
  docs: {
    container: DocsContainer,
    page: DocsPage
  }
});

configure(require.context('../src', true, /\.story\.(js|mdx)$/), module);

// function loadStories() {
//   require('../stories/index.js');
//   require.context('../src', true, /\.story\.js$/);
// }

// configure(loadStories, module);
