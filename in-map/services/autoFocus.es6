import {focusCurrentlyHighlightedEntity} from 'in-map/services/focus';
import {AUTO_FOCUS} from 'in-map/misc/TimingConfig';
import {rawQuery$} from 'in-stores/search';


export function init() {
  rawQuery$.debounce(AUTO_FOCUS).subscribe(focusCurrentlyHighlightedEntity);
}
