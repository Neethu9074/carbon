import React from 'react';

import locals from './Deprecation.mless';

export default function Deprecation({ title, children }) {
  return (
    <div className={locals.wrapper}>
      <h2 className={locals.title}>{title}</h2>

      <div className={locals.description}>{children}</div>
    </div>
  );
}
