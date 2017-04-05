import { open } from 'in-stores/search/searchBarExpanded';

export default function onPressed(e) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return;
  }

  e.preventDefault();
  open();

  // In cases were the field is already visible, we want to force refocus of the field.
  const searchField = document.querySelector('.in-searchbar .CodeMirror');
  if (searchField) {
    searchField.CodeMirror.focus();
  }
}
