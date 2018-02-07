import React from 'react';

import { endpointDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${endpointDashboard}/summary`,
    component: () => <div>Summary</div>
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
    label: 'Business',
    path: `${endpointDashboard}/business`,
    component: () => <div>Business</div>
  },
  {
    label: 'Infrastructure',
    path: `${endpointDashboard}/infrastructure`,
    component: () => <div>Infrastructure</div>
  },
  {
    label: 'Errors',
    path: `${endpointDashboard}/errors`,
    component: () => <div>Errors</div>
  },
  {
    label: 'Events',
    path: `${endpointDashboard}/events`,
    component: () => <div>Events</div>
  }
];
