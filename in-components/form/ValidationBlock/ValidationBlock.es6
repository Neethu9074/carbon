import React from 'react';

import {evaluateClassNames} from 'in-services/util/classnames';

import './ValidationBlock.less';

const block = 'in-form-validation-block';

export default function ValidationBlock({children, className, hasError}) {
  return (
    <p className={evaluateClassNames({
          [block]: true,
          [`${block}--has-error`]: hasError,
          [className]: className
        })}>
      {children}
    </p>
  );
}
