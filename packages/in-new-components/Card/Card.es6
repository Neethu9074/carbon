import React from 'react';

import locals from './Card.mless';

export default function Card({ title, children }) {
  return (
    <div className={locals.card}>
      <div className={locals.header}>
        <div className={locals.title}>{title}</div>
      </div>

      <div className={locals.body}>{children}</div>
    </div>
  );
}
