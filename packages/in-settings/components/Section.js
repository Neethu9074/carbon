import React from 'react';

import classNames from 'classnames';

import locals from './Section.mless';

export default function Section({ restrictWidth, children, className }) {
  return (
    <div
      style={{
        maxWidth: restrictWidth
      }}
      className={classNames(locals.section, className)}
    >
      {children}
    </div>
  );
}
