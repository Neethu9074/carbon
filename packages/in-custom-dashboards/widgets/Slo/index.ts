/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Slo/ShowCase';
export { default as Form } from 'in-custom-dashboards/widgets/Slo/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Slo/SloWidgetPresenter';
export { createForm } from 'in-custom-dashboards/widgets/Slo/form';

import { isSloWidgetEnabled } from 'in-custom-dashboards/widgets/Slo/constants';
import { t } from 'in-i18n';

export const type = 'slo2';
export const label = t('in-custom-dashboards:widgets.slo.slo');
export const minimumWidth = 6;
export const minimumHeight = 26;
export const enabled = isSloWidgetEnabled;
export const trackViews = isSloWidgetEnabled;
export const badge = {
  content: 'BETA'
};

// For the future we would like to have this value calculated from the minimumHeight of the
// grid-config but for now we are just using a hard coded height for the preview chart.
// We did the same for in-custom-dashboards/widgets/Apdex.
export const widgetPreviewHeight = 210;
