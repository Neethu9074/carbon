import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {view$, types} from 'in-stores/view';

export const isTableVisible$ = createTrackingStore({
  name: 'tableView/isOpen',
  observable: navigationParameters$
    .map(params => 'tableView' in params.query)
    .distinct()
}).observable;


export function toggleTableViewVisibility() {
  mutateUrl(params => {
    if ('tableView' in params.query) {
      delete params.query.tableView;
    } else {
      params.query.tableView = 'true';
    }
    return params;
  });
}


export function openTableView() {
  mutateUrl(params => {
    params.query.tableView = 'true';
    return params;
  });
}

export function closeTableView() {
  mutateUrl(params => {
    delete params.query.tableView;
    return params;
  });
}


export function init() {
  view$.subscribe(view => {
    if (view !== types.physical) {
      closeTableView();
    }
  });
}
