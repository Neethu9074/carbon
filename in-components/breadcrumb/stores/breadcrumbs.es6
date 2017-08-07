import { createStore } from 'in-stores/store';

const breadcrumbStore = createStore({
  name: 'in-components/breadcrumb/breadcrumbs',
  initialValue: []
});
export const breadcrumbs$ = breadcrumbStore.observable;

export function replaceBreadcrumbs(newBreadcrumbs) {
  breadcrumbStore.mutateTo(newBreadcrumbs);
}
