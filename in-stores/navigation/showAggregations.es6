import {navigationParameters$, cloneDeep, toUrl} from 'in-stores/navigation/navigation';

export const toggleShowAggregationsLink$ = navigationParameters$
  .map(cloneDeep)
  .map(params => {
    if (params.query.sa === '1') {
      delete params.query.sa;
    } else {
      params.query.sa = '1';
    }
    return params;
  })
  .map(toUrl)
  .distinct();
