/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export { default as showCase } from 'in-custom-dashboards/widgets/TimeZones/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/TimeZones/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/TimeZones/Widget';
export { createForm } from 'in-custom-dashboards/widgets/TimeZones/form';
export { demo } from 'in-custom-dashboards/widgets/TimeZones/demo';

export const type = 'timeZones';
export const label = t('in-custom-dashboards:widgets.timezone.index.timeZone');
export const minimumWidth = 1;
export const minimumHeight = 7;
export const enabled = true;
