import { getModifiedUrlStream } from 'in-stores/navigation/navigation';

export const toggleShowAggregationsLink$ = getModifiedUrlStream(params => {
  if (params.query.sa === '1') {
    delete params.query.sa;
  } else {
    params.query.sa = '1';
  }
});
