import * as application from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import * as mobileApp from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
import * as website from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import * as event from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';

const all = {
  [application.source]: application,
  [website.source]: website,
  [event.source]: event,
  [mobileApp.source]: mobileApp
};
export default all;

export const enabledDataSources = Object.fromEntries(Object.entries(all).filter(entry => entry[1].enabled));
