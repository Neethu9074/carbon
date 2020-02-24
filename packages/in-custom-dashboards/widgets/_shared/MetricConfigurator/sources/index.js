import * as website from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import * as event from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';

export default {
  [website.source]: website,
  [event.source]: event
};
