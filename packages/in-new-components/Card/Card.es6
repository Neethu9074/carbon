import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Card.mless';

export default function Card({ title, children, withoutPadding }) {
  return (
    <div className={locals.card}>
      <div className={locals.header}>
        <div className={locals.title}>{title}</div>
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
