import React, { Fragment } from 'react';

import Badge from 'in-new-components/Badge/Badge';

import locals from './TabHeader.mless';

export default function TabHeader({ icon, count, tab: { label } }) {
  return (
    <Fragment>
      {icon}
      <span className={locals.label}>{label}</span>
      {count != null && <Badge kind="light">{count}</Badge>}
    </Fragment>
  );
}
