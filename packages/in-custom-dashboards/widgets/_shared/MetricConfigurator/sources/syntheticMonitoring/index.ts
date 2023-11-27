/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/syntheticMonitoring/FormComponent';
import { t } from 'in-i18n';

export {
  createForm,
  migrate
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/syntheticMonitoring/form';

export const Form = FormComponent;
//source is mapped to MetricSource.SYNTHETICS defined in backend
export const source = 'SYNTHETICS';
export const label = t('in-custom-dashboards:widgets.srcSyntheticMonitoring.index.syntheticMonitoring');
export const visible = true;
