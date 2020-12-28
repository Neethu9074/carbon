import classNames from 'classnames';
import React from 'react';

import './Content.less';

const block = 'in-tooltip__content';

export default function TooltipContent({ children, className }) {
  return (
    <div
      className={classNames({
        [block]: true,
        [className]: className
      })}
    >
      {children}
    </div>
  );
}
