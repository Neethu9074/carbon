import { getTabHeaderWithAppDataMetricCount } from 'in-new-components/LocationAwareTabView/tabs/getTabHeaderWithAppDataMetricCount';
import PerformanceTab from 'in-applications/Dashboards/commonTabs/performance/Performance';
import ErrorMessagesTab from 'in-applications/Dashboards/commonTabs/messages/ErrorMessages';
import LogMessagesTab from 'in-applications/Dashboards/commonTabs/messages/LogMessages';
import Configuration from 'in-applications/Dashboards/application/tabs/Configuration';
import InfrastructureTab from 'in-applications/Dashboards/commonTabs/Infrastructure';
import Summary from 'in-applications/Dashboards/application/tabs/Summary/Summary';
import Services from 'in-applications/Dashboards/application/tabs/Services';
import { applicationDashboard } from 'in-applications/navigation/paths';
import Map from 'in-applications/Dashboards/application/tabs/Map';
import { role } from 'in-stores/user';

export default [
  {
    label: 'Summary',
    path: `${applicationDashboard}/summary`,
    component: Summary
  },
  {
    label: 'Dependencies',
    path: `${applicationDashboard}/map`,
    component: Map,
    stickToHeader: true,
    isFullWidth: true
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
    label: 'Error Messages',
    path: `${applicationDashboard}/errorMessages`,
    component: ErrorMessagesTab,
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
              metric: 'errorMessages',
              aggregation: 'DISTINCT_COUNT'
            }
          }
        };
      }
    })
  },
  {
    label: 'Log Messages',
    path: `${applicationDashboard}/logMessages`,
    component: LogMessagesTab,
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
              metric: 'logs',
              aggregation: 'DISTINCT_COUNT'
            }
          }
        };
      }
    })
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
