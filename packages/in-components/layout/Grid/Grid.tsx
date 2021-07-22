/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

// @ts-expect-error
import locals from './Grid.mless';

export interface RowProps {
  children: React.ReactNode;
  className?: string;
  style?: Record<string, string | number>;
  withoutTopMargin?: boolean;
  verticallyStretchColumns?: boolean;
  singleRowTopMargin?: boolean;
  withoutSideMargin?: boolean;
  withBottomMargin?: boolean;
}

export interface ColProps {
  lg?: number | boolean;
  lgOffset?: number;
  md?: number | boolean;
  mdOffset?: number;
  xs?: number | boolean;
  xsOffset?: number;
  children: React.ReactNode;
  className?: string;
  style?: Record<string, string | number>;
  preserveVerticalGutter?: boolean;
}

export const Row = ({
  children,
  className,
  style,
  withoutTopMargin,
  verticallyStretchColumns,
  singleRowTopMargin,
  withoutSideMargin,
  withBottomMargin
}: RowProps) => {
  return (
    <div
      className={classNames(className, {
        [locals.row]: true,
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
}: ColProps) => {
  return (
    <div
      className={classNames(className, {
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
        [locals['xs--auto-preserve-vertical']]: xs === true && preserveVerticalGutter
      })}
      style={style}
    >
      {children}
    </div>
  );
};
