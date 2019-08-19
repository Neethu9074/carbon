import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Capitalize.mless';

export default function Capitalize({ children, className }) {
  return <span className={joinClassNames(locals.wrapper, className)}>{children}</span>;
}
