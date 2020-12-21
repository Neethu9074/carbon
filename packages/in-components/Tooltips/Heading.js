import React from 'react';

import classNames from 'classnames';

import './Heading.less';

const block = 'in-tooltip__heading';

export default function TooltipHeading({ className, style, children }) {
  return (
    <h2
      className={classNames({
        [block]: true,
        [className]: className
      })}
      style={style}
    >
      {children}
    </h2>
  );
}
