/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createStore } from 'in-stores/store';

const focusStore = createStore({
  name: 'in-components/SearchBar/stores/focus',
  initialValue: false
});

export const isFocused$ = focusStore.observable.distinct().nextFrame();

export function setFocused(focused) {
  focusStore.applyStateMutation(() => focused);
}

export function tryFocusSearch(onSuccess) {
  // In cases were the field is already visible, we want to force refocus of the field.
  const searchField = document.querySelector('.in-searchbar .CodeMirror');
  if (searchField) {
    if (onSuccess) {
      onSuccess();
    }
    searchField.CodeMirror.focus();
  }
}
