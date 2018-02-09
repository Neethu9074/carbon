import React from 'react';

import Summary from 'in-applications/Dashboards/endpoint/tabs/Summary';
import { endpointDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${endpointDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Flow Map',
    path: `${endpointDashboard}/flow`,
    component: () => <div>Flow Map</div>
  },
  {
    label: 'Performance',
    path: `${endpointDashboard}/performance`,
    component: () => <div>Performance</div>
  },
  {
    label: 'Infrastructure',
    path: `${endpointDashboard}/infrastructure`,
    component: () => <div>Infrastructure</div>
  }
];
