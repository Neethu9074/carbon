import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Card.mless';

export default function Card({ title, children, withoutPadding, header, className }) {
  return (
    <div className={className}>
      <div className={locals.header}>
        <div className={locals.title}>{title}</div>
        {header}
      </div>

      <div
        className={evaluateClassNames({
          [locals.body]: true,
          [locals.bodyWithoutPadding]: withoutPadding
        })}
      >
        {children}
      </div>
    </div>
  );
}
