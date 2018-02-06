import React from 'react';

import Infrastructure from 'in-applications/Dashboards/application/tabs/Infrastructure';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import Summary from 'in-applications/Dashboards/application/tabs/Summary';
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
    component: Infrastructure
  }
];
