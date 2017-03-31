import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './FormGroup.less';

const block = 'in-form-group';

export default function FormGroup({ children, className }) {
  return (
    <div className={joinClassNames(block, className)}>
      {children}
    </div>
  );
}
