import { tryFocusSearch } from 'in-components/SearchBar/stores/focus';

export default function onPressed(e) {
  if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
    return;
  }

  e.preventDefault();
  tryFocusSearch();
}
