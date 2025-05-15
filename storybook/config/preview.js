/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* import-sort-ignore */
import { DocsPage, DocsContainer } from '@storybook/addon-docs';
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

import 'in-init/steps/commonStyles';

import theme from './theme';
import locals from './config.mless';

// globals
window.__DEV__ = true;

export const globalTypes = {};

export const decorators = [
  Story => (
    <ThemeProvider>
      <TooltipPresenter />
      <OverlayPresenter />
      <div id="main" role="main" className={locals.root}>
        <Story />
      </div>
    </ThemeProvider>
  )
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },

  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },

  docs: {
    theme,
    toc: {
      title: 'Table of Contents',
      headingSelector: 'h1, h2, h3'
    },
    container: ({ children, ...rest }) => {
      return (
        <DocsContainer {...rest}>
          <ThemeProvider>{children}</ThemeProvider>
        </DocsContainer>
      );
    },
    page: DocsPage
  }
};

export default {
  // enable rendering docs per default - this might need follow-up work
  // when it won't pick up the typescript types properly.
  // If we do not see much benefit, it could be disabled for the moment.
  tags: ['autodocs']
};
