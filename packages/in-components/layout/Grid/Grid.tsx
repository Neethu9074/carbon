/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import locals from './Grid.mless';

export interface RowProps<CustomComponent extends React.ElementType> {
  as?: CustomComponent;
  children: React.ReactNode;
  className?: string;
  style?: Record<string, string | number>;
  withoutTopMargin?: boolean;
  verticallyStretchColumns?: boolean;
  singleRowTopMargin?: boolean;
  withoutSideMargin?: boolean;
  withBottomMargin?: boolean;
}

export interface ColProps<CustomComponent extends React.ElementType> {
  as?: CustomComponent;
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
  ariaLabel?: string;
}

export const Row = <CustomComponent extends React.ElementType>({
  as,
  children,
  className,
  style,
  withoutTopMargin,
  verticallyStretchColumns,
  singleRowTopMargin,
  withoutSideMargin,
  withBottomMargin
}: RowProps<CustomComponent>) => {
  const Component = as ?? 'div';

  return (
    <Component
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
    </Component>
  );
};

export const Col = <CustomComponent extends React.ElementType>({
  as,
  lg,
  lgOffset,
  md,
  mdOffset,
  xs,
  xsOffset,
  children,
  className,
  style,
  preserveVerticalGutter,
  ariaLabel
}: ColProps<CustomComponent>) => {
  const Component = as ?? 'div';

  return (
    <Component
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
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
};
