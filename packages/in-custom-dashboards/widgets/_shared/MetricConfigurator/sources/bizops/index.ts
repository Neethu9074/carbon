/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import FormComponent from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/bizops/FormComponent';
import { t } from 'in-i18n';

export { createForm, migrate } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/bizops/form';

export const Form = FormComponent;

export const source: string = 'BIZOPS';
export const label: string = t('in-custom-dashboards:widgets.srcBizOps.index.bizOps');

export const visible: boolean = true;
