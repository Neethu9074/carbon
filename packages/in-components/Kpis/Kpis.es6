import React from 'react';

import locals from './Kpis.mless';

export default function Kpis(props) {
  return <div className={locals.kpis}>{props.children}</div>;
}
