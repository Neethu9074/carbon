import getPhysicalContent from 'in-components/Controls/components/physicalContent';
import getLogicalContent from 'in-components/Controls/components/logicalContent';
import {createStore} from 'in-stores/store';


const controls = createStore({
  name: 'Controls/contentStore',
  initialValue: null
});
export const controls$ = controls.observable;


export const CONTROL_PRESETS = {
  PHYSICAL: 'physical',
  LOGICAL: 'logical'
};

export function setControls(_content) {
  controls.applyStateMutation(() => {
    switch (_content) {
      case CONTROL_PRESETS.PHYSICAL:
      return getPhysicalContent();
      case CONTROL_PRESETS.LOGICAL:
      return getLogicalContent();
      default:
      return null;
    }
  });
}
