import React, { Fragment } from 'react';

export default function TabHeader({ icon, count, tab: { label } }) {
  return (
    <Fragment>
      {icon}
      {label}
      {count}
    </Fragment>
  );
}
