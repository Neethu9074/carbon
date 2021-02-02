/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';
import { entityCountWidgetEnabled, infraMetricsWidgetEnabled } from 'in-services/featureFlags';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/form';
export const Form = FormComponent;

export const source = 'INFRASTRUCTURE_METRICS';
export const label =
  'Infrastructure & Platforms ' +
  (entityCountWidgetEnabled ? 'Metrics ' : '') +
  (infraMetricsWidgetEnabled ? '(Beta)' : '(coming soon)');
export const disabled = !infraMetricsWidgetEnabled;
export const visible = true;
export const minGranularity = 10000;
export const suggestedNumberOfDataPoints = 400;
