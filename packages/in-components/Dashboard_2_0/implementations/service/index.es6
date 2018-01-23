import React from 'react';

import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import ApplicationViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationViewBreadcrumb';
import Infrastructure from 'in-components/Dashboard_2_0/implementations/service/Infrastructure';
import Performance from 'in-components/Dashboard_2_0/implementations/service/Performance';
import Endpoints from 'in-components/Dashboard_2_0/implementations/service/Endpoints';
import FlowMap from 'in-components/Dashboard_2_0/implementations/service/FlowMap';
import Summary from 'in-components/Dashboard_2_0/implementations/service/Summary';

export default {
  breadcrumbs: [<ApplicationViewBreadcrumb />, <ApplicationServiceViewBreadcrumb />],

  tabs: [
    {
      label: 'Summary',
      path: '/',
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
  ]
};
