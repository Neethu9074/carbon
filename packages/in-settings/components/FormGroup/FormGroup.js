import classNames from 'classnames';
import React from 'react';

import './FormGroup.less';

const block = 'in-settings-form-group';

export default function FormGroup({ children, className, style, noFlex = false }) {
  return (
    <div
      className={classNames({
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
