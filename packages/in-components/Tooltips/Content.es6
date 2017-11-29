import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './Content.less';

const block = 'in-tooltip__content';

export default function TooltipContent({ children, className }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [className]: className
      })}
    >
      {children}
    </div>
  );
}
