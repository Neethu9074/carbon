import rpt from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Badge.mless';

export const kinds = ['bold', 'light', 'inverted'];

export default Badge;
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
  children: rpt.node.isRequired,
  className: rpt.string,
  color: rpt.string,
  kind: rpt.string
};
