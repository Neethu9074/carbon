import {createStore} from 'in-stores/store';

const tagsFilterStore = createStore({
  name: 'tagsFilter',
  initialValue: ''
});
export const tagsFilter$ = tagsFilterStore.observable;

export function setTagsFilter(filter) {
  tagsFilterStore.applyStateMutation(() => filter);
}
