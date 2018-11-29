import React, { Fragment } from 'react';

import MicrometerDistributionSummariesTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerDistributionSummariesTable';
import MicrometerFunctionCounterTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerFunctionCounterTable';
import MicrometerLongTaskTimersTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerLongTaskTimersTable';
import MicrometerFunctionTimersTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerFunctionTimersTable';
import MicrometerTimeGaugesTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerTimeGaugesTable';
import MicrometerCountersTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerCountersTable';
import MicrometerTimersTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerTimersTable';
import MicrometerGaugesTable from 'in-sdk/components/dashboard/customMetrics/micrometer/MicrometerGaugesTable';

export default function MicrometerMetrics({ snapshot, timeConfig, titlePrefix }) {
  return (
    <Fragment>
      <MicrometerTimeGaugesTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerGaugesTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerCountersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerTimersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerDistributionSummariesTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerLongTaskTimersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerFunctionCounterTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
      <MicrometerFunctionTimersTable snapshot={snapshot} timeConfig={timeConfig} titlePrefix={titlePrefix} />
    </Fragment>
  );
}
