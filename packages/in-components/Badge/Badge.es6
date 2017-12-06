import rpt from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Badge.mless';

export default Badge;
function Badge({ children, size }) {
  return (
    <span
      className={evaluateClassNames({
        [locals.badge]: true,
        [locals[size]]: size
      })}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: rpt.node.isRequired,
  size: rpt.oneOf(['sm'])
};
