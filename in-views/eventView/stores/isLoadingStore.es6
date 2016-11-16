import {createStore} from 'in-stores/store';


const isLoadingStore = createStore({
  name: 'eventView/isLoadingStore',
  initialValue: false
});
export const isLoading$ = isLoadingStore.observable;

export function setIsLoading(val) {
  isLoadingStore.mutateTo(val);
}
