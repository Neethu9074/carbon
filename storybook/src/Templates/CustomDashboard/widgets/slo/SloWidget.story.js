import { just } from 'reactive-observables';
import React from 'react';

import { Widget, demo } from 'in-custom-dashboards/widgets/Slo';
import Stack from 'in-new-components/layout/Stack';

export default {
  title: 'Templates|CustomDashboard/widgets/Slo',
  component: Widget
};

export function States() {
  return (
    <Stack>
      <Widget />
      <Widget title="Demo" config={demo} />
      <Widget title="isPreview" config={demo} customHeight={200} isPreview />
    </Stack>
  );
}

const demoApi = {
  getSliReport: (id, slo) =>
    just({
      data: {
        sli: 0.979,
        slo,
        totalErrorBudget: 81066,
        errorBudgetRemaining: 81066 - 46200,
        fromTimestamp: 1588779900000,
        toTimestamp: 1594817079371
      }
    })
};

export function WithFakeData() {
  return <Widget title="Availability SLO" config={demo} customHeight={120} api={demoApi} />;
}
