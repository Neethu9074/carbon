import {createTrackingStore} from 'in-stores/store';
import {viewStructure} from 'in-stores/view';


const processViewStructure$ = createTrackingStore({
  name: 'processViewStructure',
  observable: viewStructure.map(structure => {
    return {
      viewStructure: structure
    };
  })
}).observable;

export default processViewStructure$;
