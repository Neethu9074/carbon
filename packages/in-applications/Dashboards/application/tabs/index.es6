import { getTabHeaderWithAppDataMetricCount } from 'in-new-components/LocationAwareTabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import Configuration from 'in-applications/Dashboards/application/tabs/Configuration';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import MessagesTab from 'in-applications/Dashboards/commonTabs/messages/Messages';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { role } from 'in-stores/user';

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
    icon: 'lib_application_service',
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
    label: 'Messages',
    path: `${applicationDashboard}/messages`,
    component: MessagesTab
  },
  {
    label: 'Infrastructure',
    path: `${applicationDashboard}/infrastructure`,
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
  },
  role.canConfigureApplications && {
    label: 'Configuration',
    path: `${applicationDashboard}/configuration`,
    component: Configuration
  }
].filter(Boolean);
