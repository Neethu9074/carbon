import rpt from 'prop-types';
import React from 'react';

import locals from './Badge.mless';

export default Badge;
function Badge({ children, color }) {
  color = color || '#A5B6BE';
  return (
    <span
      className={locals.badge}
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
  children: rpt.node.isRequired,
  color: rpt.string
};
