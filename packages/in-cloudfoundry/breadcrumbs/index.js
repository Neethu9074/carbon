/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ApplicationBreadcrumb from 'in-cloudfoundry/breadcrumbs/ApplicationBreadcrumb';
import HomeViewBreadcrumb from 'in-cloudfoundry/breadcrumbs/HomeViewBreadcrumb';

export function ApplicationBreadcrumbs(props) {
  const { applicationId } = props;
  return [<HomeViewBreadcrumb />, applicationId && <ApplicationBreadcrumb {...props} />];
}
