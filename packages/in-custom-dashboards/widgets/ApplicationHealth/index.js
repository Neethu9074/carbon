/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { applicationHealthOverviewEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export { default as showCase } from 'in-custom-dashboards/widgets/ApplicationHealth/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/ApplicationHealth/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/ApplicationHealth/Widget';
export { createForm } from 'in-custom-dashboards/widgets/ApplicationHealth/form';

export const type = 'applicationHealth';
export const label = t('in-custom-dashboards:widgets.applicationHealth.index.applicationHealth');
export const minimumWidth = 2;
export const minimumHeight = 15;
export const enabled = applicationHealthOverviewEnabled;
