import { getTabHeaderWithAppDataMetricCount } from 'in-applications/TabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import { applicationDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${applicationDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Services',
    path: `${applicationDashboard}/services`,
    component: Services,
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
              metric: 'services',
              aggregation: 'DISTINCT_COUNT'
            }
          }
        };
      }
    })
  },
  {
    label: 'Performance',
    path: `${applicationDashboard}/performance`,
    component: PerformanceTab
  },
  {
    label: 'Infrastructure',
    path: `${applicationDashboard}/infrastructure`,
    component: InfrastructureTab,
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
