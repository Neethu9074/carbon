/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Grid.mless';

export const Row = ({
  children,
  className,
  style,
  withoutTopMargin,
  verticallyStretchColumns,
  singleRowTopMargin,
  withoutSideMargin,
  withBottomMargin
}) => {
  return (
    <div
      className={classNames({
        [locals.row]: true,
        [className]: className,
        [locals.withoutTopMargin]: withoutTopMargin,
        [locals.verticallyStretchColumns]: verticallyStretchColumns,
        [locals.singleRowTopMargin]: singleRowTopMargin,
        [locals.withoutSideMargin]: withoutSideMargin,
        [locals.withBottomMargin]: withBottomMargin
      })}
      style={style}
    >
      {children}
    </div>
  );
};

export const Col = ({
  lg,
  lgOffset,
  md,
  mdOffset,
  xs,
  xsOffset,
  children,
  className,
  style,
  preserveVerticalGutter
}) => {
  return (
    <div
      className={classNames({
        [locals[`lg--${lg}`]]: typeof lg === 'number',
        [locals[`lg-offset--${lgOffset}`]]: typeof lgOffset === 'number',
        [locals['lg--auto']]: lg === true,
        [locals['lg--auto']]: lg === true && !preserveVerticalGutter,
        [locals['lg--auto-preserve-vertical']]: lg === true && preserveVerticalGutter,

        [locals[`md--${md}`]]: typeof md === 'number',
        [locals[`md-offset--${mdOffset}`]]: typeof mdOffset === 'number',
        [locals['md--auto']]: md === true && !preserveVerticalGutter,
        [locals['md--auto-preserve-vertical']]: md === true && preserveVerticalGutter,

        [locals[`xs--${xs}`]]: typeof xs === 'number',
        [locals[`xs-offset--${xsOffset}`]]: typeof xsOffset === 'number',
        [locals['xs--auto']]: xs === true && !preserveVerticalGutter,
        [locals['xs--auto-preserve-vertical']]: xs === true && preserveVerticalGutter,

        [className]: className != null
      })}
      style={style}
    >
      {children}
    </div>
  );
};
