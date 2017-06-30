import { tryFocusSearch } from 'in-components/SearchBar/stores/focus';
import { open } from 'in-stores/search/searchBarExpanded';

export default function onPressed(e) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return;
  }

  e.preventDefault();
  open();
  tryFocusSearch();
}
