/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event/FormComponent';
import { t } from 'in-i18n';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event/form';
export const Form = FormComponent;
export const source = 'EVENT';
export const label = t('in-custom-dashboards:widgets.srcEvent.index.events');
export const visible = true;
