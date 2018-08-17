import React, { Fragment } from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import SvgIcon from 'in-components/SvgIcon';
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
  const { type, result, renderSubTypes } = props;
  return (
    <Fragment>
      <div className={locals.labelAligned}>
        <SvgIcon className={locals.serviceIcon} type={getIconByType(type)} width={32} height={32} />
        <h1 className={locals.label}>{result.data.label}</h1>
        {renderSubTypes && renderSubTypes(props)}
      </div>
    </Fragment>
  );
}

function getIconByType(type) {
  if (type === 'Application') {
    return 'lib_application';
  }
  if (type === 'Service') {
    return 'lib_application_service';
  }
  if (type === 'Endpoint') {
    return 'lib_application_endpoint';
  }
  if (type === 'Trace') {
    return 'lib_application_trace';
  }
}
