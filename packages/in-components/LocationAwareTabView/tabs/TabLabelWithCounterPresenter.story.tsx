/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import TabLabelWithCounterPresenter from 'in-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import TabLabelWithCounterPresenter from 'in-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';

export default {
  component: TabLabelWithCounterPresenter
};

export function Default() {
  const countersResult = { data: { vms: 5 } };

  return <TabLabelWithCounterPresenter label="Virtual Machines" countersResult={countersResult} resultPropName="vms" />;
}
