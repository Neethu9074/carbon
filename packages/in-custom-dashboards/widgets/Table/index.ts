/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { customWidgetEventsTableEnabled } from 'in-services/featureFlags';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Table/eventsTable/ShowCase';

export { default as Widget } from 'in-custom-dashboards/widgets/Table/Widget';

export { createForm } from 'in-custom-dashboards/widgets/Table/form';

export { default as Form } from 'in-custom-dashboards/widgets/Table/FormComponent';

export const type = 'table';
export const label = 'Table';
export const minimumWidth = 5;
export const minimumHeight = 18;
export const enabled = customWidgetEventsTableEnabled;
export const badge = {
  content: 'BETA'
};
