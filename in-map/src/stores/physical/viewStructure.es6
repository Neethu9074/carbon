import {createTrackingStore} from 'in-stores/store';
import {viewStructure} from 'in-stores/view';


export default createTrackingStore({
  name: 'physicalViewStructure',
  observable: viewStructure
}).observable;
