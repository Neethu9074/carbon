import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import App20Kpi from 'in-components/Kpis/AppKpi';
import InfraKpi from 'in-components/Kpis/InfrastructureKpi';

import locals from './Kpis.mless';

export function KpiSection(props) {
  return <DashboardSection className={locals.kpis}>{props.children}</DashboardSection>;
}

export const AppKpi = App20Kpi;
export const InfrastructureKpi = InfraKpi;
