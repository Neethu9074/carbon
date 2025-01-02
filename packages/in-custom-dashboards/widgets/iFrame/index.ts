/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { iframeEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';
export { default as Widget } from 'in-custom-dashboards/widgets/iFrame/Widget';
export { default as Form } from 'in-custom-dashboards/widgets/iFrame/FormComponent';
export { createForm } from 'in-custom-dashboards/widgets/iFrame/form';
export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/iFrame/ShowCase';

export const type = 'iframe';
export const label = t('in-custom-dashboards:widgets.iFrame.title');
export const minimumWidth = 10;
export const minimumHeight = 20;
export const enabled = iframeEnabled;
export const showWidgetSelector = false;
export const isEditing = true;
export const isBeta = true;
