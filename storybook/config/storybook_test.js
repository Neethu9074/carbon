/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node,jest */

import initStoryshots, { renderWithOptions } from '@storybook/addon-storyshots';
import path from 'path';
import { mount } from 'enzyme';

initStoryshots({
  configPath: path.join(__dirname, '.'),
  framework: 'react',
  test:
    // Just render the story, don't check the output at all.
    // This is useful as a low-effort way of Smoke Testing your components to ensure they do not error.
    renderWithOptions({ renderer: mount })
});
