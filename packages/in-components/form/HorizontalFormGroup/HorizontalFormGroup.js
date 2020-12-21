import React from 'react';

import classNames from 'classnames';

import locals from './HorizontalFormGroup.mless';

export default function HorizontalFormGroup({ className, withoutBottomMargin, label, formElement }) {
  return (
    <div
      className={classNames({
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
