/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* import-sort-ignore */
import { DocsContainer } from '@storybook/addon-docs';
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

import theme from './theme';
import './i18n';
import locals from './config.mless';

// globals
window.__DEV__ = true;

const SUPPORTED_THEMES = [
  { name: 'default', info: 'Instana' },
  { name: 'g10', info: 'Carbon' }
];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'default',
    toolbar: {
      icon: 'beaker',
      items: SUPPORTED_THEMES.map(({ name, info }) => ({ value: name, title: name.toUpperCase(), right: info })),
      dynamicTitle: true
    }
  }
};

export const decorators = [
  (Story, { globals }) => (
    <ThemeProvider theme={globals.theme}>
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
      const { context: globals } = rest;
      return (
        <DocsContainer {...rest}>
          <ThemeProvider theme={globals.theme}>{children}</ThemeProvider>
        </DocsContainer>
      );
    }
  }
};

// export const parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   // Make docs panel the primary one
//   previewTabs: { 'storybook/docs/panel': { index: -1 } },

//   // badgesConfig: {
//   //   [BADGE.BETA]: {
//   //     styles: {
//   //       backgroundColor: '#D2EBFD',
//   //       borderColor: '#D2EBFD',
//   //       color: '#4397F7'
//   //     },
//   //     title: 'Beta'
//   //   },
//   //   [BADGE.DEPRECATED]: {
//   //     styles: {
//   //       backgroundColor: '#FDF1E7',
//   //       borderColor: '#FDF1E7',
//   //       color: '#EE7F31'
//   //     },
//   //     title: 'Deprecated'
//   //   }
//   // },

//   // More options: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#sorting-stories
//   options: {
//     storySort: {
//       order: [
//         'Getting Started',
//         ['Home'],
//         'Formatting',
//         'Global',
//         'Design Guidelines',
//         'Design Tokens',
//         ['General Usage', 'Colors IDS', 'Colors CDS'],
//         'Carbon',
//         'Components',
//         ['Overview'],
//         'Patterns',
//         'Hooks',
//         'Utils'
//       ]
//     }
//   },

//   docs: {
//     theme,
//     toc: {
//       title: 'Table of Contents',
//       headingSelector: 'h1, h2, h3'
//     },
//     container: ({ children, ...rest }) => {
//       const { context: globals } = rest;
//       return (
//         <DocsContainer {...rest}>
//           <ThemeProvider theme={globals.theme}>{children}</ThemeProvider>
//         </DocsContainer>
//       );
//     }
//   },

//   // Set docs page as default
//   viewMode: 'docs'
// };
