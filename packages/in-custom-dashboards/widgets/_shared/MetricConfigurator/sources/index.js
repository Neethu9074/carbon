import * as mobileApp from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
import * as website from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import * as event from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';

const sources = {
  [website.source]: website,
  [event.source]: event
};

if (mobileAppMonitoringEnabled) {
  sources[mobileApp.source] = mobileApp;
}

export default sources;
