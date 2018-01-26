import React from 'react';

import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import ApplicationViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationViewBreadcrumb';
import Infrastructure from 'in-applications/Dashboards/service/tabs/Infrastructure';
import Performance from 'in-applications/Dashboards/service/tabs/Performance';
import Endpoints from 'in-applications/Dashboards/service/tabs/Endpoints';
import FlowMap from 'in-applications/Dashboards/service/tabs/FlowMap';
import Summary from 'in-applications/Dashboards/service/tabs/Summary';

export const tabs = [
  {
    label: 'Summary',
    path: '/summary',
    component: Summary
  },
  {
    label: 'FlowMap',
    path: '/flowMap',
    component: FlowMap
  },
  {
    label: 'Endpoints',
    path: '/endpoints',
    component: Endpoints
  },
  {
    label: 'Performance',
    path: '/performance',
    component: Performance
  },
  {
    label: 'Infrastructure',
    path: '/infrastructure',
    component: Infrastructure
  }
];

export const breadcrumbs = [<ApplicationViewBreadcrumb />, <ApplicationServiceViewBreadcrumb />];
