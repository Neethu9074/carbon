/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/slo/FormComponent';
import { sloFullEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/slo/form';

export const Form = FormComponent;
export const source = 'SLO';
export const label = t('in-custom-dashboards:widgets.srcSlo.index.serviceLevelsObjective');
export const visible = sloFullEnabled;
