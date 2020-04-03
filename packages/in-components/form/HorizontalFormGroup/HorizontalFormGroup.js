import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './HorizontalFormGroup.mless';

export default function HorizontalFormGroup({ className, withoutBottomMargin, label, formElement }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.withoutBottomMargin]: withoutBottomMargin,
        [className]: className
      })}
    >
      {formElement}
      {label}
    </div>
  );
}
