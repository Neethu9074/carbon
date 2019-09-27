import PropTypes from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Badge.mless';

function Badge({ children, className, color, kind = 'bold' }) {
  let style;
  if (kind == 'bold') {
    style = {
      background: color
    };
  } else if (kind == 'inverted') {
    style = {
      color
    };
  }
  return (
    <span style={style} className={joinClassNames(locals.badge, `${locals[kind]}`, className)}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  kind: PropTypes.oneOf(['bold', 'light', 'inverted'])
};

Badge.defaultProps = {
  kind: 'bold'
};

export default Badge;
