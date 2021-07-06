/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* import-sort-ignore */

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { configure, addDecorator } from '@storybook/react';
import { addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';

// ################################################
// Start: Initialize Instana specific globals
import './i18n';
import './globals';
import './globalTagDefinition';

// End: Initialize Instana specific globals
// ################################################
import OverlayPresenter from 'in-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';

import 'in-themes/foundation.less';
import '@instana/components/esm/index.css';
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
    theme: {
      brandTitle: 'Instana',
      ...themes.light
    }
  },
  docs: {
    container: DocsContainer,
    page: DocsPage
  }
});

configure(require.context('../src', true, /\.story\.(js|ts|tsx|mdx)$/), module);
