import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import './HelpBlock.less';

const block = 'in-form-help-block';

export default function HelpBlock({ children, className }) {
  return (
    <div className={joinClassNames(block, className)}>
      {children}
    </div>
  );
}
