/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export { default as showCase } from 'in-custom-dashboards/widgets/TopList/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/TopList/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/TopList/Widget';
export { createForm, migrate } from 'in-custom-dashboards/widgets/TopList/form';

export const type = 'topList';
export const label = t('in-custom-dashboards:widgets.topList.index.topListLb');
export const minimumWidth = 3;
export const minimumHeight = 16;
export const enabled = true;
export const badge = {
  content: 'BETA'
};
