import { getTabHeaderWithAppDataMetricCount } from 'in-new-components/LocationAwareTabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import MessagesTab from 'in-applications/Dashboards/commonTabs/messages/Messages';
import Infrastructure from 'in-applications/Dashboards/commonTabs/Infrastructure';
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
    label: 'Flow',
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
    label: 'Messages',
    path: `${endpointDashboard}/messages`,
    component: MessagesTab
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
