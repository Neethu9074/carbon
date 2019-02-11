import { assign, omit } from 'lodash';
import React from 'react';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import { evaluateClassNames } from 'in-services/util/classnames';
import theme from 'in-themes';

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
      {...omit(props, ['active'])}
      className={evaluateClassNames({
        [props.className]: true,
        [locals.tr]: true,
        [locals[`depth-${props.depth || 1}`]]: true,
        [locals.trCompact]: props.size === 'compact',
        [locals.trRegular]: props.size !== 'compact',
        [locals.trClickable]: props.onClick,
        [locals.active]: props.active,
        [locals.dull]: props.dull
      })}
    />
  );
}

export function Th(props) {
  return (
    <th
      {...omit(props, ['noWrap'])}
      className={evaluateClassNames({
        [props.className]: true,
        [locals.th]: true,
        [locals.noWrap]: props.noWrap
      })}
    />
  );
}

export function Td(props) {
  const style = props.style ? { ...props.style } : {};
  if (props.ellipsis) {
    style.maxWidth = props.ellipsis;
  }
  return (
    <td
      {...omit(props, ['noWrap', 'ellipsis', 'active'])}
      style={style}
      className={evaluateClassNames({
        [props.className]: true,
        [locals.td]: true,
        [locals.noWrap]: props.noWrap,
        [locals.ellipsis]: props.ellipsis,
        [locals.active]: props.active
      })}
    />
  );
}

export function ErroneousRowTh() {
  return <Th width={14} className={locals.erroneousRowTh} />;
}

export function ErroneousRowTd({ isErroneous = true }) {
  return <Td className={locals.erroneousRowTd}>{isErroneous && <div className={locals.erroneousRowIcon}>!</div>}</Td>;
}

export function SeverityIndicatorCellContentWrapper({ severity, children }) {
  if (severity == null || severity < 0) {
    return children;
  }

  const background = severity === 0 ? theme.lib.colors.success : getDesignLibraryColorBySeverity(severity);
  return (
    <div className={locals.severityIndicatorCellContentWrapper}>
      <div className={locals.severityIndicatorCellContentWrapperIndicator} style={{ background }}>
        &nbsp;
      </div>
      {children}
    </div>
  );
}
