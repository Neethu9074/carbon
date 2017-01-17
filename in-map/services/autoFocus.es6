import {focusCurrentlyHighlightedEntity} from 'in-map/services/focus';
import {rawQuery$} from 'in-stores/search';


export function init() {
  rawQuery$.debounce(500).subscribe(focusCurrentlyHighlightedEntity);
}
