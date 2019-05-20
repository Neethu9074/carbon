import React from 'react';

import DropwizardDashboardExtensions from 'promise-loader?global,internal!in-internal/monitoringUnit/DropwizardDashboardExtensions';
import { createAsyncComponentWithLoadingIndicatorPlaceholder } from 'in-components/routing/createAsyncComponent';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { percentage } from 'in-services/formatters/number';

const DashboardExtensions = createAsyncComponentWithLoadingIndicatorPlaceholder(DropwizardDashboardExtensions);

export default function DropwizardDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      {instanaInternalFeaturesEnabled && <DashboardExtensions snapshot={snapshot} timeConfig={timeConfig} />}
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        postProcessRow={instanaInternalFeaturesEnabled && postProcessRow}
      />
    </div>
  );
}

function postProcessRow(row) {
  if (row.type === 'gauge' && (row.name.endsWith('.error_rate') || row.name.startsWith('log.'))) {
    row.metrics.forEach(m => (m.formatter = percentage.detailed));
  }
}
