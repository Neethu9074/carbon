'use strict';

import _ from 'lodash';

import {consts} from 'in-themes';

const defaultTheme = 'night';

// we expect the user's current theme to be set as a global variable via
// server-side includes or a similar mechanism. This will allow us to show
// the correct color scheme immediately, i.e. without switching during runtime
// or after an initial paint
export const themeName = _.get(
  window,
  ['instana', 'settings', 'theme'],
  defaultTheme
);

export const theme = consts[themeName];

export function setThemeOnHtmlDocument() {
  document.documentElement.classList.add('in-theme-' + themeName);
}
