import classNames from 'classnames';
import React from 'react';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ children, className, horizontal }) {
  const cssClass = classNames({
    [locals.group]: true,
    [locals.vertical]: !horizontal,
    [locals.horizontal]: horizontal,
    [className]: !!className
  });

  return (
    <div className={cssClass} role="group">
      {children}
    </div>
  );
}
