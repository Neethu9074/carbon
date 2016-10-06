import {createStore} from 'in-stores/store';


const globeSize = createStore({
  name: 'globeview/globeSizeStore',
  initialValue: 0
});
export const globeSize$ = globeSize.observable.distinct();

export function setGlobeSize(size) {
  globeSize.applyStateMutation(() => size);
}
