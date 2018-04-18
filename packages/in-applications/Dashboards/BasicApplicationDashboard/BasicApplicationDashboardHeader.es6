import React, { Fragment } from 'react';

import Skeleton from 'in-components/Progress/Skeleton';
import Title from 'in-components/Title';

import locals from './BasicApplicationDashboardHeader.mless';

export default function BasicApplicationDashboardHeader(props) {
  const { result, renderActions, type } = props;
  let content;
  if (result.data == null) {
    content = (
      <Fragment>
        <Title title={type} />
        <LoadingState {...props} />
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <Title title={type} dynamic={result.data.label} />
        <SuccessState {...props} />
      </Fragment>
    );
  }

  return (
    <header className={locals.header}>
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
