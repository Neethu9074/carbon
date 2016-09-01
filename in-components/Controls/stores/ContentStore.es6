import getPhysicalContent from 'in-components/Controls/components/physicalContent';
import getLogicalContent from 'in-components/Controls/components/logicalContent';
import {createStore} from 'in-stores/store';


const content = createStore({
  name: 'Controls/contentStore',
  initialValue: null
});
export const content$ = content.observable;


export const CONTENT_TYPES = {
  PHYSICAL: 'physical',
  LOGICAL: 'logical'
};

export function setContent(_content) {
  content.applyStateMutation(() => {
    switch (_content) {
      case CONTENT_TYPES.PHYSICAL:
      return getPhysicalContent();
      case CONTENT_TYPES.LOGICAL:
      return getLogicalContent();
      default:
      return null;
    }
  });
}
