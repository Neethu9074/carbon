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

export const Col = ({ lg, lgOffset, md, mdOffset, xs, xsOffset, children, className, style }) => {
  return (
    <div
      className={classNames({
        [locals[`lg--${lg}`]]: typeof lg === 'number',
        [locals[`lg-offset--${lgOffset}`]]: typeof lgOffset === 'number',
        [locals['lg--auto']]: lg === true,

        [locals[`md--${md}`]]: typeof md === 'number',
        [locals[`md-offset--${mdOffset}`]]: typeof mdOffset === 'number',
        [locals['md--auto']]: md === true,

        [locals[`xs--${xs}`]]: typeof xs === 'number',
        [locals[`xs-offset--${xsOffset}`]]: typeof xsOffset === 'number',
        [locals['xs--auto']]: xs === true,

        [className]: className != null
      })}
      style={style}
    >
      {children}
    </div>
  );
};
