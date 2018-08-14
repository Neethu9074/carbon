import React from 'react';

import DropwizardDashboardExtensions from 'promise-loader?global,internal!in-internal/DropwizardDashboardExtensions';
import { createAsyncComponentWithLoadingIndicatorPlaceholder } from 'in-components/routing/createAsyncComponent';
import CustomMetrics from 'in-sdk/components/dashboard/customMetrics/CustomMetrics';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';

const DashboardExtensions = createAsyncComponentWithLoadingIndicatorPlaceholder(DropwizardDashboardExtensions);

export default function DropwizardDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      {instanaInternalFeaturesEnabled && <DashboardExtensions snapshot={snapshot} timeConfig={timeConfig} />}
      <CustomMetrics snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
