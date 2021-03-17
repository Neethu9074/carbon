/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ApplicationHealthOverview from 'in-new-components/ApplicationHealthOverview';

export default {
  title: 'Organisms|ApplicationhealthOverview',
  component: ApplicationHealthOverview
};

const config = [
  {
    id: 'JBslXCNOSqqJbT3C6oXfhA',
    label: 'Login',
    openIssues: 2,
    maxSeverity: 3
  },
  {
    id: 'btg-B701Rx6o9QNXUS4TVw',
    label: 'Signup',
    openIssues: 2,
    maxSeverity: 3
  },
  {
    id: '4i2Oy5MuSLi0g2PPSgk9kg',
    label: 'Google Auth',
    openIssues: 2,
    maxSeverity: 6
  },
  {
    id: 'p4jFA4yLSD6UbmNpQjWYRg',
    label: 'Login App',
    openIssues: 0,
    maxSeverity: 0
  }
];

export function SampleOverview() {
  return <ApplicationHealthOverview title="Auth Applications" applications={config} />;
}

const paginatedConfig = () => {
  let appList = [];
  for (let index = 0; index < 4; index++) {
    appList = [...appList, ...config];
  }
  return appList;
};

export function WithPagination() {
  return <ApplicationHealthOverview title="Auth Applications" applications={paginatedConfig()} />;
}
