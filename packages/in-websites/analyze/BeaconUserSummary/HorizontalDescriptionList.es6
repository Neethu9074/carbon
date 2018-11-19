import React from 'react';

import locals from './HorizontalDescriptionList.mless';

export function Dl({ children }) {
  return <dl className={locals.list}>{children}</dl>;
}

export function Di({ title, children }) {
  return (
    <div className={locals.item}>
      <dt className={locals.title}>{title}</dt>
      <dd className={locals.description}>{children}</dd>
    </div>
  );
}
