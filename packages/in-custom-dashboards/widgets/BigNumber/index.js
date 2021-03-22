/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export { default as showCase } from 'in-custom-dashboards/widgets/BigNumber/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/BigNumber/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/BigNumber/Widget';
export { createForm, migrate } from 'in-custom-dashboards/widgets/BigNumber/form';
export { demo } from 'in-custom-dashboards/widgets/BigNumber/demo';

export const type = 'bigNumber';
export const label = t('in-custom-dashboards:widgets.bigNumber.bigNumber');
export const minimumWidth = 1;
export const minimumHeight = 4;
export const enabled = true;
