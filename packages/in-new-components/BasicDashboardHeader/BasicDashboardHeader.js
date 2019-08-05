import React, { Fragment } from 'react';

import Skeleton from 'in-new-components/Loading/Skeleton';
import PluginIcon from 'in-components/PluginIcon';
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
      {content}
      {renderActions && <div className={locals.actions}>{renderActions(props)}</div>}
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
  const { icon, result, renderSubTypes, getLabel = defaultGetLabel, pluginIcon } = props;
  return (
    <Fragment>
      <div className={locals.labelAligned}>
        {pluginIcon ? (
          <PluginIcon className={locals.icon} snapshot={pluginIcon} size="s" />
        ) : (
          <SvgIcon className={locals.icon} type={icon} size="l" />
        )}
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
