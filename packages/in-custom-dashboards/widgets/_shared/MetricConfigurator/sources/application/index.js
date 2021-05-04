/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/FormComponent';
import { t } from 'in-i18n';

export { createForm, migrate } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/form';

export const Form = FormComponent;
export const source = 'APPLICATION';
export const label = t('in-custom-dashboards:widgets.srcApp.index.applicationsTracesAndCalls');
export const visible = true;
