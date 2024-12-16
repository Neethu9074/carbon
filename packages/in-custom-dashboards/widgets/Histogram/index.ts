/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { beeinstanaHistogramsEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Histogram/ShowCase';
export { default as Form } from 'in-custom-dashboards/widgets/Histogram/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Histogram/Widget';
export { createForm } from 'in-custom-dashboards/widgets/Histogram/form';

export const type = 'histogram';
export const label = t('in-custom-dashboards:widgets.histogram.histogram');
export const minimumWidth = 6;
export const minimumHeight = 13;
export const enabled = beeinstanaHistogramsEnabled;
