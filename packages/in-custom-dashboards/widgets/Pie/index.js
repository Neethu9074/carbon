/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { pieWidgetEnabled } from 'in-services/featureFlags';

export { default as showCase } from 'in-custom-dashboards/widgets/Pie/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/Pie/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Pie/Widget';
export { createForm, migrate } from 'in-custom-dashboards/widgets/Pie/form';

export const type = 'pie';
export const label = 'Chart: Pie';
export const minimumWidth = 3;
export const minimumHeight = 15;
export const enabled = pieWidgetEnabled;
export const badge = {
  content: 'BETA'
};
