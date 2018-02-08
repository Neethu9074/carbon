import React from 'react';

import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import { applicationDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${applicationDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Services',
    path: `${applicationDashboard}/services`,
    component: Services
  },
  {
    label: 'Performance',
    path: `${applicationDashboard}/performance`,
    component: () => <div />
  },
  {
    label: 'Infrastructure',
    path: `${applicationDashboard}/infrastructure`,
    component: InfrastructureTab
  }
];
