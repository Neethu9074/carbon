import { getTabHeaderWithAppDataMetricCount } from 'in-new-components/TabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import ErrorsTab from 'in-applications/Dashboards/commonTabs/errors/Errors';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import Configuration from 'in-applications/Dashboards/application/tabs/Configuration';
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
    icon: 'app_service',
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
    label: 'Errors',
    path: `${applicationDashboard}/errors`,
    component: ErrorsTab
  },
  {
    label: 'Infrastructure',
    path: `${applicationDashboard}/infrastructure`,
    component: InfrastructureTab,
    icon: 'app_infrastructure',
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
  },
  {
    label: 'Configuration',
    path: `${applicationDashboard}/configuration`,
    component: Configuration
  }
];
