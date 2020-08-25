import { just } from 'reactive-observables';
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

const ts = new Date('2020-08-20 20:20:00').getTime(); // 1597947600000

const demoApi = {
  getUnifiedMetrics: () =>
    just({
      errors: [],
      progress: { loading: false },
      data: [
        { id: 'sli', values: [[ts, 0.979]] },
        { id: 'budget', values: [[ts, 81066]] },
        { id: 'spent', values: [[ts, 46200]] },
        { id: 'remaining', values: [[ts, 81066 - 46200]] }
      ]
    })
};

export function WithFakeData() {
  return <Widget title="Availability SLO" config={demo} customHeight={120} api={demoApi} />;
}
