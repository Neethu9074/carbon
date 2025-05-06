/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import * as syntheticMonitoring from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/syntheticMonitoring';
import { bizopsBusinessMetricsCustomDashboardEnabled, syntheticCustomDashboardEnabled } from 'in-services/featureFlags';
import * as businessMetrics from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/businessMetrics';
import * as infrastructure from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure';
import * as application from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import * as mobileApp from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
import * as website from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import * as logging from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging';
import * as bizops from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/bizops';
import * as event from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import * as sli from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import * as slo from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/slo';

let all = {
  [bizops.source]: bizops,
  [infrastructure.metrics.source]: infrastructure.metrics,
  [application.source]: application,
  [mobileApp.source]: mobileApp,
  [website.source]: website,
  [event.source]: event,
  [sli.source]: sli,
  [slo.source]: slo,
  [logging.source]: logging
};
if (syntheticCustomDashboardEnabled) {
  all = { ...all, [syntheticMonitoring.source]: syntheticMonitoring };
}
if (bizopsBusinessMetricsCustomDashboardEnabled) {
  all = { ...all, [businessMetrics.source]: businessMetrics };
}

export default all;

export const enabledDataSources = Object.fromEntries(Object.entries(all).filter(entry => entry[1].enabled));
