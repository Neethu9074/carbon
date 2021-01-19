/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Widget, demo } from 'in-custom-dashboards/widgets/Slo';
import Stack from 'in-new-components/layout/Stack';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO',
  component: Widget
};

export function States() {
  return (
    <Stack>
      <Widget />
      <Widget title="Demo" config={demo} />
      <Widget title="Loading" config={demo} customHeight={200} />
    </Stack>
  );
}

export function WithFakeData() {
  return <Widget title="Availability SLO" config={demo} customHeight={120} />;
}
