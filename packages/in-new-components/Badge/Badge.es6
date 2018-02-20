import rpt from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import locals from './Badge.mless';

export default Badge;
function Badge({ className, children, color = '#a5b6be' }) {
  return (
    <span
      className={joinClassNames(locals.badge, className)}
      style={{
        borderColor: color,
        color
      }}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  className: rpt.string,
  children: rpt.node.isRequired,
  color: rpt.string
};
