import rpt from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { lighten } from 'in-services/formatters/color';

import locals from './Pill.mless';

export const kinds = ['bold', 'light', 'lighter', 'inverted'];

export default function Pill({ className, children, color = '#000000', kind = 'bold' }) {
  let style;
  if (kind == 'inverted') {
    style = { color };
  } else if (kind == 'light') {
    style = {
      color,
      background: lighten(color, 0.1)
    };
  } else if (kind == 'lighter') {
    style = {
      color: '#fff',
      background: '#BCC4CC'
    };
  } else {
    style = {
      background: color
    };
  }

  return (
    <span className={joinClassNames(locals.pill, `${locals[kind]}`, className)} style={style}>
      {children}
    </span>
  );
}

Pill.propTypes = {
  kind: rpt.string,
  color: rpt.string,
  className: rpt.string,
  children: rpt.node.isRequired
};
