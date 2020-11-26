import React, { forwardRef } from 'react';
import rpt from 'prop-types';

import { joinClassNames } from 'in-services/util/classnames';
import { lighten } from 'in-services/formatters/color';

import locals from './Pill.mless';

export const kinds = ['primary'];

function Pill({ className, children, color = '#000000', lightenOpacity = 0.1, kind = 'bold' }, ref) {
  let style;
  // For users leveraging our pre-defined kinds, we do not support the color and lightenOpacity props.
  // Instead, it works similar to our Button component.
  if (kinds.indexOf(kind) === -1) {
    if (kind === 'inverted') {
      style = { color };
    } else if (kind === 'light') {
      style = {
        color,
        background: lighten(color, lightenOpacity)
      };
    } else if (kind === 'lighter') {
      style = {
        color: '#fff',
        background: '#BCC4CC'
      };
    } else {
      style = {
        background: color
      };
    }
  }

  return (
    <span className={joinClassNames(locals.pill, `${locals[kind]}`, className)} style={style} ref={ref}>
      {children}
    </span>
  );
}

export default forwardRef(Pill);

Pill.propTypes = {
  kind: rpt.string,
  color: rpt.string,
  className: rpt.string,
  children: rpt.node.isRequired,
  lightenOpacity: rpt.number
};

Pill.defaultProps = {
  kind: 'bold',
  color: '#000000',
  lightenOpacity: 0.1
};
