import React from 'react';

import Infrastructure from 'in-components/Dashboard_2_0/implementations/application/Infrastructure';
import ApplicationViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationViewBreadcrumb';
import Performance from 'in-components/Dashboard_2_0/implementations/application/Performance';
import Services from 'in-components/Dashboard_2_0/implementations/application/Services';
import Summary from 'in-components/Dashboard_2_0/implementations/application/Summary';

export default {
  breadcrumbs: [<ApplicationViewBreadcrumb />],

  tabs: [
    {
      label: 'Summary',
      path: '/',
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
      component: Performance
    },
    {
      label: 'Infrastructure',
      path: '/infrastructure',
      component: Infrastructure
    }
  ]
};
