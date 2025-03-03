/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/SloLegacy/ShowCase';
export { default as Form } from 'in-custom-dashboards/widgets/SloLegacy/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/SloLegacy/SloWidgetPresenter';
export { createForm } from 'in-custom-dashboards/widgets/SloLegacy/form';

import { sloLiteEnabled, sloFullEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export const type = 'slo';
export const label = sloFullEnabled
  ? t('in-custom-dashboards:widgets.slo.sloLegacy')
  : t('in-custom-dashboards:widgets.slo.sloLite');
export const minimumWidth = 6;
export const minimumHeight = 18;
export const enabled = sloLiteEnabled || sloFullEnabled;
export const trackViews = true;

// For the future we would like to have this value calculated from the minimumHeight of the
// grid-config but for now we are just using a hard coded height for the preview chart.
// We did the same for in-custom-dashboards/widgets/Apdex.
export const widgetPreviewHeight = 210;
