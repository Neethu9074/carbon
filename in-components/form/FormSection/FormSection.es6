import React from 'react';

import {joinClassNames} from 'in-services/util/classnames';

import './FormSection.less';

const block = 'in-form-section';

export default function FormSection({children, className, heading}) {
  return (
    <div className={joinClassNames(block, className)}>
      {heading ?
        <h3 className={`${block}__heading`}>
          {heading}
        </h3>
      : null}
      {children}
    </div>
  );
}
