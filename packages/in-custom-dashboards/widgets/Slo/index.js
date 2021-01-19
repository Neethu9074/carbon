/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export { default as showCase } from 'in-custom-dashboards/widgets/Slo/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/Slo/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Slo/Widget';
export { createForm } from 'in-custom-dashboards/widgets/Slo/form';
export { demo } from 'in-custom-dashboards/widgets/Slo/demo';

import { sloWidgetEnabled } from 'in-services/featureFlags';

export const type = 'slo';
export const label = 'SLO';
export const minimumWidth = 8;
export const minimumHeight = 18;
export const enabled = sloWidgetEnabled;
