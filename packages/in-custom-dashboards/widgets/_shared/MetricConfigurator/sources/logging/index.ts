/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging/FormComponent';
import { percentageDetailed } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging/form';
export const source = 'LOG';
export const label = t('in-custom-dashboards:widgets.srcLogging.index.logging');
export const visible = true;
export const defaultFormatterId = percentageDetailed.id;

export const Form = FormComponent;
