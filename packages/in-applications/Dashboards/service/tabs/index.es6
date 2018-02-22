import { getTabHeaderWithAppDataMetricCount } from 'in-applications/TabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Endpoints from 'in-applications/Dashboards/service/tabs/Endpoints';
import FlowMap from 'in-applications/Dashboards/service/tabs/FlowMap';
import Summary from 'in-applications/Dashboards/service/tabs/Summary';
import { serviceDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${serviceDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Flow Map',
    path: `${serviceDashboard}/flowMap`,
    component: FlowMap
  },
  {
    label: 'Endpoints',
    path: `${serviceDashboard}/endpoints`,
    component: Endpoints,
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
              metric: 'endpoints',
              aggregation: 'DISTINCT_COUNT'
            }
          }
        };
      }
    })
  },
  {
    label: 'Performance',
    path: `${serviceDashboard}/performance`,
    component: PerformanceTab
  },
  {
    label: 'Infrastructure',
    path: `${serviceDashboard}/infrastructure`,
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
