/* eslint-env node */
import React from 'react';

// ################################################
// Start: Initialize Instana specific globals
import 'in-themes/foundation.less';
import './globals';
import './globalTagDefinition';
// End: Initialize Instana specific globals
// ################################################

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { configure, addDecorator } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { create } from '@storybook/theming';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';

import locals from './config.mless';

addDecorator(story => (
  <>
    <TooltipPresenter />
    <OverlayPresenter />
    <div className={locals.root}>{story()}</div>
  </>
));

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
