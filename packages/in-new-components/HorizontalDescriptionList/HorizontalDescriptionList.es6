import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import { isBlank } from 'in-services/util/string';

import locals from './HorizontalDescriptionList.mless';

export function Dl({ children }) {
  return <dl className={locals.list}>{children}</dl>;
}

export function Di({ title, children, ddClassName }) {
  if (children == null || (typeof children === 'string' && isBlank(children))) {
    return null;
  }

  return (
    <div className={locals.item}>
      <dt className={locals.title}>{title}</dt>
      <dd className={joinClassNames(locals.description, ddClassName)}>{children}</dd>
    </div>
  );
}
