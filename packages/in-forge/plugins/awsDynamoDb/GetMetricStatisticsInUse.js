import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function GetMetricStatisticsInUse({ snapshot }) {
  return (
    <div>
      {snapshot.getIn(['data', 'legacy_endpoint_used'], false) && (
        <DashboardNotification type="info">
          GetMetricStatistics method is being used for metrics acquisition! In order to reduce AWS costs enable
          cloudwatch:GetMetricData permission for the agent.
        </DashboardNotification>
      )}
    </div>
  );
}
