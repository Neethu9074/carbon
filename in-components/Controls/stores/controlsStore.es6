import {create} from 'reactive-observables';

import getPhysicalContent from 'in-components/Controls/components/physicalContent';
import getLogicalContent from 'in-components/Controls/components/logicalContent';

export const controls$ = create().emit(null);

export const CONTROL_PRESETS = {
  PHYSICAL: 'physical',
  LOGICAL: 'logical'
};

export function setControls(_content) {
  if (_content === CONTROL_PRESETS.PHYSICAL) {
    controls$.emit(getPhysicalContent());
  } else if (_content === CONTROL_PRESETS.LOGICAL) {
    controls$.emit(getLogicalContent());
  } else {
    controls$.emit(null);
  }
}
