import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Section.mless';

export default function Section({ title, light, children }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.lightWrapper]: light
      })}
    >
      <h1 className={locals.header}>{title}</h1>
      {children}
    </div>
  );
}
