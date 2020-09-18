/* eslint-env node */
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { addParameters } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import TooltipPresenter from 'in-components/Tooltip/TooltipPresenter';
// import './globalTagDefinition';
import './globals';

import locals from './config.mless';
import 'in-themes/foundation.less';

addDecorator(story => (
  <>
    <TooltipPresenter />
    <OverlayPresenter />
    <div className={locals.root}>{story()}</div>
  </>
));

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage
  },
  options: {
    showRoots: true
  }
});
