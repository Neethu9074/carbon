/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* import-sort-ignore */

import { DocsPage, DocsContainer } from '@storybook/addon-docs';
import { themes } from '@storybook/theming';
import { ThemeProvider } from '@instana/components';
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
import '@instana/legacy/esm/index.css';
import '@instana/components/esm/index.css';
import locals from './config.mless';

export const decorators = [
  story => (
    <ThemeProvider theme="g10">
      <TooltipPresenter />
      <OverlayPresenter />
      <div id="main" role="main" className={locals.root}>
        {story()}
      </div>
    </ThemeProvider>
  )
];

export const parameters = {
  options: {
    theme: {
      brandTitle: 'Instana',
      ...themes.light
    }
  },
  actions: { argTypesRegex: '^on[A-Z].*' },

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },

  docs: {
    container: DocsContainer,
    page: DocsPage
  }
};
