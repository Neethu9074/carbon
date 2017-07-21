import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './Heading.less';

const block = 'in-tooltip__heading';

export default function TooltipHeading({ className, style, children }) {
  return (
    <h2
      className={evaluateClassNames({
        [block]: true,
        [className]: className
      })}
      style={style}
    >
      {children}
    </h2>
  );
}
