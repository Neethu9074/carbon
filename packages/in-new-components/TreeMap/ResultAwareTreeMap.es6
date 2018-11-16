import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Skeleton from 'in-new-components/Loading/Skeleton';
import TreeMap from 'in-new-components/TreeMap';

import locals from './ResultAwareTreeMap.mless';

export default function ResultAwareTreeMap(props) {
  const { result } = props;

  const isLoading = result.progress.loading;
  if (isLoading) {
    return <Skeleton className={locals.skeletonTreeMap} />;
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  return <TreeMap {...props} data={result.data} />;
}
