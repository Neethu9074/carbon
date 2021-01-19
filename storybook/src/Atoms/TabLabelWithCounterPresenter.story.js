/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';

export default {
  title: 'Atoms|TabLabelWithCounter',
  component: TabLabelWithCounterPresenter
};

export function Default() {
  const countersResult = { data: { vms: 5 } };

  return <TabLabelWithCounterPresenter label="Virtual Machines" countersResult={countersResult} resultPropName="vms" />;
}
