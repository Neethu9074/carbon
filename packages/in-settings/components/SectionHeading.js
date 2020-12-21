import React from 'react';

import classNames from 'classnames';

import locals from './typography.mless';

export default function SectionHeading({ children, withoutTopSpacing }) {
  return (
    <h3
      className={classNames({
        [locals.sectionHeading]: true,
        [locals.sectionHeadingWithoutTopPadding]: withoutTopSpacing
      })}
    >
      {children}
    </h3>
  );
}
