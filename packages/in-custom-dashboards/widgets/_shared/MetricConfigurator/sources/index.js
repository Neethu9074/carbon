import * as application from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import * as mobileApp from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
import * as website from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import * as event from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';

export default {
  [application.source]: application,
  [website.source]: website,
  [event.source]: event,
  [mobileApp.source]: mobileApp
};
