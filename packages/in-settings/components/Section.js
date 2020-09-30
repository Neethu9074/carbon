import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Section.mless';

export default function Section({ restrictWidth, children, className }) {
  return (
    <div
      style={{
        maxWidth: restrictWidth
      }}
      className={joinClassNames(locals.section, className)}
    >
      {children}
    </div>
  );
}
