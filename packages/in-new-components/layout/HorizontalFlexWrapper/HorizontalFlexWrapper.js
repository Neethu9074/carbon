import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './HorizontalFlexWrapper.mless';

export default function HorizontalFlexWrapper({ className, children }) {
  return <div className={joinClassNames(locals.wrapper, className)}>{children}</div>;
}
