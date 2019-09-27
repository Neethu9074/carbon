/* eslint-env node */
import React from 'react';

import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

import locals from './config.mless';

setOptions({
  theme: {
    brandTitle: 'Instana'
  }
});

addDecorator(story => <div className={locals.root}>{story()}</div>);

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage
  }
});

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
