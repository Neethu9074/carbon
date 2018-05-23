import { getTabHeaderWithAppDataMetricCount } from 'in-new-components/LocationAwareTabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import Infrastructure from 'in-applications/Dashboards/commonTabs/Infrastructure';
import ErrorsTab from 'in-applications/Dashboards/commonTabs/errors/Errors';
import Summary from 'in-applications/Dashboards/endpoint/tabs/Summary';
import FlowMap from 'in-applications/Dashboards/endpoint/tabs/FlowMap';
import { endpointDashboard } from 'in-applications/navigation/paths';

export default [
  {
    label: 'Summary',
    path: `${endpointDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Flow Map',
    path: `${endpointDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    isFullWidth: true
  },
  {
    label: 'Performance',
    path: `${endpointDashboard}/performance`,
    component: PerformanceTab
  },
  {
    label: 'Errors',
    path: `${endpointDashboard}/errors`,
    component: ErrorsTab
  },
  {
    label: 'Infrastructure',
    path: `${endpointDashboard}/infrastructure`,
    component: Infrastructure,
    icon: 'lib_infrastructure',
    header: getTabHeaderWithAppDataMetricCount({
      getMetricsParams({ timeConfig, applicationId, serviceId, endpointId }) {
        return {
          filter: {
            timeConfig,
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
].filter(v => !!v);
