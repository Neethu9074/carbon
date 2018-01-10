import React from 'react';

import ApplicationViewBreadcrumb from 'in-views/applicationView/breadcrumbs/ApplicationViewBreadcrumb';
import Summary from 'in-components/Dashboard_2_0/implementations/application/Summary';

export default {
  breadcrumbs: [<ApplicationViewBreadcrumb />],

  tabs: [
    {
      label: 'Summary',
      path: '/',
      component: Summary
    }
  ]
};
