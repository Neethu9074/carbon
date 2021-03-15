/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { configure, addDecorator } from '@storybook/react';
import { addParameters } from '@storybook/react';
/* eslint-env node */
import React from 'react';
import { themes } from '@storybook/theming';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
import './globalTagDefinition';
import './globals';
import './i18n';

// ################################################
// Start: Initialize Instana specific globals
import 'in-themes/foundation.less';
import locals from './config.mless';

// End: Initialize Instana specific globals
// ################################################

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

configure(require.context('../src', true, /\.story\.(js|mdx)$/), module);
