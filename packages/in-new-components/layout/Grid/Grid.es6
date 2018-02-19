import React from 'react';

import { joinClassNames, evaluateClassNames } from 'in-services/util/classnames';
import locals from './Grid.mless';

export const Row = ({ children, className, style }) => {
  return (
    <div className={joinClassNames(locals.row, className)} style={style}>
      {children}
    </div>
  );
};

export const Col = ({ lg, lgOffset, xs, xsOffset, children, className, style }) => {
  return (
    <div
      className={evaluateClassNames({
        [locals[`lg--${lg}`]]: typeof lg === 'number',
        [locals[`lg-offset--${lgOffset}`]]: typeof lgOffset === 'number',
        [locals['lg--auto']]: lg === true,

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
