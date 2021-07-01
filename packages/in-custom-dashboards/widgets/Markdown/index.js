/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Markdown/ShowCase';
export { default as Form } from 'in-custom-dashboards/widgets/Markdown/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Markdown/Widget';
export { createForm } from 'in-custom-dashboards/widgets/Markdown/form';
export { demo } from 'in-custom-dashboards/widgets/Markdown/demo';

export const type = 'markdown';
export const label = t('in-custom-dashboards:widgets.markdown.markdown');
export const minimumWidth = 1;
export const minimumHeight = 6;
export const enabled = true;
