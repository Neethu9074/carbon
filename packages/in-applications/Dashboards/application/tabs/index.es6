import React from 'react';
import Summary from 'in-applications/Dashboards/application/tabs/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';

const tabs = [
  {
    label: 'Summary',
    path: '/summary',
    component: Summary
  },
  {
    label: 'Services',
    path: '/services',
    component: Services
  },
  {
    label: 'Performance',
    path: '/performance',
    component: () => <div />
  },
  {
    label: 'Infrastructure',
    path: '/infrastructure',
    component: () => <div />
  }
];
export default tabs;
