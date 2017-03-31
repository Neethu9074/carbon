import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './HorizontalFormGroup.less';

const block = 'in-horizontal-form-group';

export default function HorizontalFormGroup({ children, className }) {
  return (
    <div className={joinClassNames(block, className)}>
      {children}
    </div>
  );
}
