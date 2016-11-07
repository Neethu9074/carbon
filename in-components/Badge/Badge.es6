import React from 'react';

import {evaluateClassNames} from 'in-services/util/classnames';

import './Badge.less';

const block = 'in-badge';

export default function Badge({children, className, size}) {
  return (
    <span className={evaluateClassNames({
            [block]: true,
            [`${block}--${size}`]: size,
            [className]: className
          })}>
      {children}
    </span>
  );
}
