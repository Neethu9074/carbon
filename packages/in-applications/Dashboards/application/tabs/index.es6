import React from 'react';
import Summary from 'in-applications/Dashboards/application/tabs/Summary';

const tabs = [
  {
    label: 'Summary',
    path: '/summary',
    component: Summary
  },
  {
    label: 'Services',
    path: '/services',
    component: () => <div />
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
