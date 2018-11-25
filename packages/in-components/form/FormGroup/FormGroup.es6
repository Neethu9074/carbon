import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import './FormGroup.less';

const block = 'in-form-group';

export default function FormGroup({ children, className, withoutBottomMargin }) {
  return (
    <div
      className={evaluateClassNames({
        [block]: true,
        [className]: className,
        [`${block}--without-bottom-margin`]: withoutBottomMargin
      })}
    >
      {children}
    </div>
  );
}
