import { combineLatest } from 'reactive-observables';

import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { canvas$ } from 'in-map/stores/indexStore';

let subscription;
export function init() {
  if (subscription) {
    return;
  }

  subscription = combineLatest([highlightedEntityId$, canvas$]).subscribe(
    ([id, canvas]) => canvas ? (canvas.style.cursor = id ? 'pointer' : 'auto') : null
  );
}
