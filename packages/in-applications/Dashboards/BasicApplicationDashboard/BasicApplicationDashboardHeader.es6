import React, { Fragment } from 'react';

import LifecycleObserver from 'in-components/LifecycleObserver';
import { setResult } from 'in-applications/stores/resultStore';
import Skeleton from 'in-components/Progress/Skeleton';

import locals from './BasicApplicationDashboardHeader.mless';

export default function BasicApplicationDashboardHeader(props) {
  const { result, renderActions } = props;
  let content;
  if (result.data == null) {
    content = <LoadingState {...props} />;
  } else {
    content = <SuccessState {...props} />;
  }

  if (__DEV__) {
    setResult(result);
  }

  return (
    <header className={locals.header}>
      {__DEV__ && <LifecycleObserver onWillUnmount={() => setResult(null)} />}
      {renderActions && <div className={locals.actions}>{renderActions(props)}</div>}
      {content}
    </header>
  );
}

function LoadingState() {
  return (
    <Fragment>
      <Skeleton className={locals.typeSkeleton} />
      <Skeleton className={locals.labelSkeleton} />
    </Fragment>
  );
}

function SuccessState(props) {
  const { result, type, renderSubTypes } = props;
  return (
    <Fragment>
      <span className={locals.type}>{type}</span>
      <div className={locals.labelAligned}>
        <h1 className={locals.label}>{result.data.label}</h1>
        {renderSubTypes && renderSubTypes(props)}
      </div>
    </Fragment>
  );
}
