import {createStore} from 'in-stores/store';


const layouting = createStore({
  name: 'physical/layouter',
  initialValue: 'physical'
});
export const layouting$ = layouting.observable;
