import {createStore} from 'in-stores/store';


const expandedView = createStore({
  name: 'viewSwitcher/expandedViewStore',
  initialValue: null
});
export const expandedView$ = expandedView.observable;

export function toggleExpandedView(view) {
  expandedView.applyStateMutation(oldView => oldView === view ? null : view);
}
