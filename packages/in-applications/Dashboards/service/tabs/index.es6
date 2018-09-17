import { getTabHeaderWithAppDataMetricCount } from 'in-new-components/LocationAwareTabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import MessagesTab from 'in-applications/Dashboards/commonTabs/messages/Messages';
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
    label: 'Flow',
    path: `${serviceDashboard}/flowMap`,
    component: FlowMap,
    stickToHeader: true,
    isFullWidth: true
  },
  {
    label: 'Endpoints',
    path: `${serviceDashboard}/endpoints`,
    component: Endpoints,
    icon: 'lib_application_endpoint',
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
    label: 'Messages',
    path: `${serviceDashboard}/messages`,
    component: MessagesTab
  },
  {
    label: 'Infrastructure',
    path: `${serviceDashboard}/infrastructure`,
    component: InfrastructureTab,
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
];
