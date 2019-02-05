import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './FormGroup.less';

const block = 'in-settings-form-group';

export default function FormGroup({ children, className, style, noFlex = false }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [className]: className,
        [`${block}--flex`]: !noFlex
      })}
      style={style}
    >
      {children}
    </div>
  );
}
