import { assign, omit } from 'lodash';
import theme from 'in-themes';
import React from 'react';

import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import classNames from 'classnames';

import locals from './Table.mless';

export function Table(props) {
  const reducedProps = assign({}, props);
  delete reducedProps.tableInCard;
  delete reducedProps.fixedLayout;

  const className = classNames({
    [props.className]: true,
    [locals.table]: true,
    [locals.fixedLayout]: props.fixedLayout,
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
      {...omit(props, ['active', 'selected'])}
      className={classNames({
        [props.className]: true,
        [locals.tr]: true,
        [locals[`depth-${props.depth || 1}`]]: true,
        [locals.trCompact]: props.size === 'compact',
        [locals.trRegular]: props.size !== 'compact' && props.size !== 'minimal',
        [locals.trMinimal]: props.size === 'minimal',
        [locals.trClickable]: props.onClick,
        [locals.active]: props.active,
        [locals.dull]: props.dull,
        [locals.selected]: props.selected
      })}
    />
  );
}

export function Th(props) {
  let additionalStyleProps = {};
  if (props.width != null && props.style) {
    props.style.width = props.widthInAbsoluteUnit ? props.width : `${props.width}%`;
  } else if (props.width != null) {
    // can't add style to props directly as props are not extensible
    additionalStyleProps = { style: { width: props.widthInAbsoluteUnit ? props.width : `${props.width}%` } };
  }
  const children = props.wrapContent ? props.wrapContent(props.children) : props.children;

  return (
    <th
      {...omit(props, ['noWrap', 'width', 'wrapContent', 'widthInAbsoluteUnit'])}
      {...additionalStyleProps}
      className={classNames({
        [locals.th]: true,
        [locals.noWrap]: props.noWrap,
        [props.className]: true
      })}
    >
      {children}
    </th>
  );
}

export function Td(props) {
  const style = props.style ? { ...props.style } : {};
  if (props.ellipsis && typeof props.ellipsis !== 'boolean') {
    style.maxWidth = props.ellipsis;
  }
  return (
    <td
      {...omit(props, ['noWrap', 'ellipsis', 'active'])}
      style={style}
      className={classNames({
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
  return <Th className={locals.erroneousRowTh} />;
}

export function ErroneousRowTd({ isErroneous = true }) {
  return <Td className={locals.erroneousRowTd}>{isErroneous && <ErrorIndicator erroneous={isErroneous} small />}</Td>;
}

export function SeverityIndicatorCellContentWrapper({ severity, children }) {
  if (severity == null || severity < 0) {
    return children;
  }

  const background = severity === 0 ? theme.lib.colors.success : getDesignLibraryColorBySeverity(severity);
  return (
    <div>
      <div className={locals.severityIndicatorCellContentWrapperIndicator} style={{ background }}>
        &nbsp;
      </div>
      {children}
    </div>
  );
}
