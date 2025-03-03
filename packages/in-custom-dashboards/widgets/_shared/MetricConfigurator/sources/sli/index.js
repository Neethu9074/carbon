/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/FormComponent';
import { sloFullEnabled, sloLiteEnabled } from 'in-services/featureFlags';
import { percentageDetailed } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/form';

export const Form = FormComponent;
export const source = 'SLI';
export const label = t('in-custom-dashboards:widgets.srcSli.index.srvLevelIndicator');
export const visible = sloLiteEnabled || sloFullEnabled;
export const defaultFormatterId = percentageDetailed.id;
