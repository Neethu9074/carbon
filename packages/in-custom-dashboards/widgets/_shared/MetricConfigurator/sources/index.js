/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import * as syntheticMonitoring from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/syntheticMonitoring';
import * as infrastructure from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure';
import * as application from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import * as mobileApp from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
import * as website from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import * as event from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import * as sli from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import * as logging from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging';
import { syntheticCustomDashboardEnabled } from 'in-services/featureFlags';

let all = {
  [infrastructure.metrics.source]: infrastructure.metrics,
  [application.source]: application,
  [mobileApp.source]: mobileApp,
  [website.source]: website,
  [event.source]: event,
  [sli.source]: sli,
  [logging.source]: logging
};
if (syntheticCustomDashboardEnabled) {
  all = { ...all, [syntheticMonitoring.source]: syntheticMonitoring };
}

export default all;

export const enabledDataSources = Object.fromEntries(Object.entries(all).filter(entry => entry[1].enabled));
