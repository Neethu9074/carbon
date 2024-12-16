/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { create } from '@storybook/theming';

import { themes } from '@instana/design-tokens';

const theme = themes.default;

export default create({
  base: 'light',
  brandTitle: 'ui-foundation storybook',
  brandImage: 'instana-logo.png',

  // used as link color
  colorSecondary: '#0f62fe',

  // Typography
  fontBase: theme.ids.font.family.option['sans-serif'],
  fontCode: theme.ids.font.family.option.monospace,
  textColor: theme.ids.color.option.neutral['900']
});
