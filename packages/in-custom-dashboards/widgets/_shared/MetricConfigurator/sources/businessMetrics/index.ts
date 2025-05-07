/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/businessMetrics/FormComponent';
import { t } from 'in-i18n';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/businessMetrics/form';

export const Form = FormComponent;

export const source: string = 'BUSINESS_METRICS';
export const label: string = t('in-custom-dashboards:widgets.srcBusinessMetrics.index.businessMetrics');

export const visible: boolean = true;
