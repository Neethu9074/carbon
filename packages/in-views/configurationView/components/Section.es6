import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Section.mless';

export default function Section({ children, className }) {
  return <div className={joinClassNames(locals.section, className)}>{children}</div>;
}
