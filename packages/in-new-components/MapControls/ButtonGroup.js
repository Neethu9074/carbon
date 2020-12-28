import classNames from 'classnames';
import React from 'react';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ vertical, children, className }) {
  return (
    <div
      className={classNames({
        [locals.group]: true,
        [locals.vertical]: vertical,
        [className]: className
      })}
    >
      {children}
    </div>
  );
}
