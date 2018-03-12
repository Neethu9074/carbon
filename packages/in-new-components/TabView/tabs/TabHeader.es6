import React, { Fragment } from 'react';

import Counter from 'in-new-components/Counter';

import locals from './TabHeader.mless';

export default function TabHeader({ icon, count, tab: { label } }) {
  return (
    <Fragment>
      {icon}
      <span className={locals.label}>{label}</span>
      {count != null && <Counter>{count}</Counter>}
    </Fragment>
  );
}
