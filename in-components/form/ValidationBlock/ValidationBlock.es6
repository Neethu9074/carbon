import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './ValidationBlock.less';

const block = 'in-form-validation-block';

export default function ValidationBlock({ children, className }) {
  return (
    <p className={joinClassNames(block, className)}>
      {children}
    </p>
  );
}
