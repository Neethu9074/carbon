import { create } from 'reactive-observables';

import getPhysicalContent from 'in-components/MapOverlayControls/components/physicalContent';

export const controls$ = create().emit(null);

export const CONTROL_PRESETS = {
  PHYSICAL: 'physical'
};

export function setControls(_content) {
  if (_content === CONTROL_PRESETS.PHYSICAL) {
    controls$.emit(getPhysicalContent());
  } else {
    controls$.emit(null);
  }
}
