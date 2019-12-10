import React from 'react';

import locals from './LeftRightPadding.mless';

import { joinClassNames } from 'in-services/util/classnames';

export default function LeftRightPadding({ children, className }) {
  return <div className={joinClassNames(locals.wrapper, className)}>{children}</div>;
}
