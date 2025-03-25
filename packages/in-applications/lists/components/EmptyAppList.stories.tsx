/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';
import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';

export default {
  component: ApplicationsNoDataNotification
};
export function EmptyAppListStory() {
  return <ApplicationsNoDataNotification />;
}
