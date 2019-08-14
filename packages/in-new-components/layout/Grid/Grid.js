import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import locals from './Grid.mless';

export const Row = ({ children, className, style, withoutTopMargin, verticallyStretchColumns }) => {
  return (
    <div
      className={evaluateClassNames({
        [locals.row]: true,
        [className]: className,
        [locals.withoutTopMargin]: withoutTopMargin,
        [locals.verticallyStretchColumns]: verticallyStretchColumns
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
      className={evaluateClassNames({
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
