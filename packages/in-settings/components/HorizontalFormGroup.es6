import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './HorizontalFormGroup.mless';

export default function HorizontalFormGroupWithBackground({ children, className }) {
  return <div className={joinClassNames(className, locals.group)}>{children}</div>;
}
