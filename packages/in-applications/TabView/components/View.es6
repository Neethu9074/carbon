import React from 'react';

import Title from 'in-components/Title';

import locals from './View.mless';

export default function View({ title, children }) {
  return (
    <div className={locals.view}>
      <Title title={title} />

      {children}
    </div>
  );
}
