import {List} from 'immutable';

import {createStore} from 'in-stores/store';

const store = createStore({
  name: 'theme',
  initialValue: window.instana.activeTheme
});
export const activeTheme = store.observable;

// make sure that the active theme is set as part of the cookie so that
// theme changes are recognized by the backend.
activeTheme.subscribe(theme => {
  document.cookie = 'in-theme=' + encodeURIComponent(theme);
});

export const theme = window.instana.activeThemeConfig;
export default theme;


export const availableThemes = List([
  'day',
  'night'
]);


export function setActiveTheme(newActiveTheme) {
  store.applyStateMutation(() => newActiveTheme);
}
