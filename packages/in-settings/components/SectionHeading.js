import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './typography.mless';

export default function SectionHeading({ children, withoutTopSpacing }) {
  return (
    <h3
      className={evaluateClassNames({
        [locals.sectionHeading]: true,
        [locals.sectionHeadingWithoutTopPadding]: withoutTopSpacing
      })}
    >
      {children}
    </h3>
  );
}
