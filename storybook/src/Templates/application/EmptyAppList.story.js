/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';

export default {
  title: 'Templates|application/ApplicationsNoDataNotification',
  component: ApplicationsNoDataNotification
};
export function EmptyAppListStory() {
  return <ApplicationsNoDataNotification />;
}
