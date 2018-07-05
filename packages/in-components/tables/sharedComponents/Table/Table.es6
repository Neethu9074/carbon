import { assign } from 'lodash';
import React from 'react';

import { evaluateClassNames, joinClassNames } from 'in-services/util/classnames';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import locals from './Table.mless';

export function Table(props) {
  const reducedProps = assign({}, props);
  delete reducedProps.tableInCard;

  const className = evaluateClassNames({
    [props.className]: true,
    [locals.table]: true,
    [locals.tableInCard]: props.tableInCard
  });
  return <table {...reducedProps} className={className} cellSpacing="0" />;
}

export function Thead(props) {
  return <thead {...props} />;
}

export function Tbody(props) {
  return <tbody {...props} />;
}

export function Tr(props) {
  return (
    <tr
      {...props}
      className={evaluateClassNames({
        [props.className]: true,
        [locals.tr]: true,
        [locals[`depth-${props.depth || 1}`]]: true,
        [locals.trCompact]: props.size === 'compact',
        [locals.trRegular]: props.size !== 'compact'
      })}
    />
  );
}

export function Th(props) {
  return <th {...props} className={joinClassNames(props.className, locals.th)} />;
}

export function Td(props) {
  return <td {...props} className={joinClassNames(props.className, locals.td)} />;
}

export function SeverityIndicatorCellContentWrapper({ severity, children }) {
  if (severity == null || severity <= 0) {
    return children;
  }

  const background = getDesignLibraryColorBySeverity(severity);
  return (
    <div className={locals.severityIndicatorCellContentWrapper}>
      <div className={locals.severityIndicatorCellContentWrapperIndicator} style={{ background }}>
        &nbsp;
      </div>
      {children}
    </div>
  );
}
