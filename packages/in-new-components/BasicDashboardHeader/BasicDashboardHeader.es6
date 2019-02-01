import React, { Fragment } from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';

import locals from './BasicDashboardHeader.mless';

export default function BasicDashboardHeader(props) {
  const { result, renderActions, title, getLabel = defaultGetLabel } = props;

  let content;
  if (result && result.data == null) {
    content = (
      <Fragment>
        <Title title={title} />
        <LoadingState {...props} />
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <Title title={title} dynamic={getLabel(result, props)} />
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
  const { icon, result, renderSubTypes, getLabel = defaultGetLabel } = props;
  return (
    <Fragment>
      <div className={locals.labelAligned}>
        <SvgIcon className={locals.icon} type={icon} width={32} height={32} />
        <h1 className={locals.label}>{getLabel(result, props)}</h1>
        {renderSubTypes && renderSubTypes(props)}
      </div>
    </Fragment>
  );
}

function defaultGetLabel(result, { title }) {
  if (!result && title) {
    return title;
  } else if (result) {
    return result.data.label || result.data.name;
  }
  return '';
}
