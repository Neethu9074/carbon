import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import locals from './Kpis.mless';

export default function Kpis(props) {
  return <DashboardSection className={locals.kpis}>{props.children}</DashboardSection>;
}
