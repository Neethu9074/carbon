/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Slo/ShowCase';
export { default as Form } from 'in-custom-dashboards/widgets/Slo/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Slo/Widget';
export { createForm } from 'in-custom-dashboards/widgets/Slo/form';
export { demo } from 'in-custom-dashboards/widgets/Slo/demo';

import { t } from 'in-i18n';

export const type = 'slo';
export const label = t('in-custom-dashboards:widgets.slo.slo');
export const minimumWidth = 6;
export const minimumHeight = 18;
export const enabled = true;
