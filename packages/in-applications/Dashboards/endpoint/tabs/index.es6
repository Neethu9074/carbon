import React from 'react';

import { getTabHeaderWithAppDataMetricCount } from 'in-applications/TabView/tabs/getTabHeaderWithAppDataMetricCount';
import Summary from 'in-applications/Dashboards/endpoint/tabs/Summary';
import Infrastructure from 'in-applications/Dashboards/commonTabs/Infrastructure';
import { endpointDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${endpointDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Flow Map',
    path: `${endpointDashboard}/flow`,
    component: () => <div>Flow Map</div>
  },
  {
    label: 'Performance',
    path: `${endpointDashboard}/performance`,
    component: () => <div>Performance</div>
  },
  {
    label: 'Infrastructure',
    path: `${endpointDashboard}/infrastructure`,
    component: Infrastructure,
    header: getTabHeaderWithAppDataMetricCount({
      getMetricsParams({ timeframe, applicationId, serviceId, endpointId }) {
        return {
          filter: {
            timeframe,
            application: applicationId,
            service: serviceId,
            endpoint: endpointId
          },
          metrics: {
            count: {
              metric: 'processes',
              aggregation: 'DISTINCT_COUNT'
            }
          }
        };
      }
    })
  }
];
