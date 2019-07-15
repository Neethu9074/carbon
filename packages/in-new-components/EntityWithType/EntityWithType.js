import React from 'react';

import Link from 'in-components/Link';

import locals from './EntityWithType.mless';

export default function EntityWithType({ label, type, href$ }) {
  return (
    <div className={locals.wrapper}>
      <div className={locals.type}>{type}</div>
      {href$ ? (
        <Link className={locals.link} href$={href$}>
          {label}
        </Link>
      ) : (
        <span className={locals.label}>{label}</span>
      )}
    </div>
  );
}
