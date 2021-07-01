/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Pie/ShowCase';
export { default as Form } from 'in-custom-dashboards/widgets/Pie/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Pie/Widget';
export { createForm, migrate } from 'in-custom-dashboards/widgets/Pie/form';

export const type = 'pie';
export const label = t('in-custom-dashboards:widgets.pie.index.chartPie');
export const minimumWidth = 3;
export const minimumHeight = 15;
export const enabled = true;
