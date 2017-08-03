import { createStore } from 'in-stores/store';

const breadcrumbStore = createStore({
  name: 'breadcrumbs',
  initialValue: []
});

export const breadcrumbs$ = breadcrumbStore.observable;

export function replaceBreadcrumbs(newBreadcrumbs) {
  breadcrumbStore.applyStateMutation(() => newBreadcrumbs);
}
