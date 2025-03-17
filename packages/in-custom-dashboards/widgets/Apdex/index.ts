/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { sloFullEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Apdex/ShowCase';
export { default as Widget } from 'in-custom-dashboards/widgets/Apdex/ApdexWidgetPresenter';
export { default as Form } from 'in-custom-dashboards/widgets/Apdex/FormComponent';
export { createForm } from 'in-custom-dashboards/widgets/Apdex/form';

export const type = 'apdex';
export const label = t('in-custom-dashboards:widgets.apdex.title');
export const minimumWidth = 6;
export const minimumHeight = 18;
export const enabled = sloFullEnabled;

// For the future we would like to have this value calculated from the minimumHeight of the
// grid-config but for now we are just using a hard coded height for the preview chart.
export const widgetPreviewHeight = 262;
