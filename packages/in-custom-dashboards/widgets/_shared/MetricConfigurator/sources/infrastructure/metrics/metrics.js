/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export { configureChart } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/configureChart';

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';
import { infraMetricsWidgetEnabled } from 'in-services/featureFlags';
import { hasInfrastructureAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/form';
export const Form = FormComponent;

export const source = 'INFRASTRUCTURE_METRICS';
export const label =
  t('in-custom-dashboards:widgets.srcInfrastructure.metrics.infrastructurePlatforms') +
  ' ' +
  (infraMetricsWidgetEnabled ? '' : t('in-custom-dashboards:widgets.srcInfrastructure.metrics.comingSoon'));
export const disabled = !infraMetricsWidgetEnabled;
export const visible = hasInfrastructureAccess;
