/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { customWidgetTableInfraDataSourceEnabled } from 'in-services/featureFlags';
import { customWidgetEventsTableEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Table/eventsTable/ShowCase';

export { default as Widget } from 'in-custom-dashboards/widgets/Table/Widget';

export { createForm } from 'in-custom-dashboards/widgets/Table/form';

export { default as Form } from 'in-custom-dashboards/widgets/Table/FormComponent';

export const type = 'table';
export const label = 'Table';
export const minimumWidth = 5;
export const minimumHeight = 18;
export const enabled = customWidgetEventsTableEnabled || customWidgetTableInfraDataSourceEnabled;
export const badge = {
  content: 'BETA'
};

export const dataSources: { [key: string]: { type: string; label: string } } = {
  EVENTS: {
    type: 'EventsTable',
    label: t('in-custom-dashboards:widgets.table.dataSource.events')
  },
  ...(customWidgetTableInfraDataSourceEnabled && { INFRA: { type: 'Infrastructure', label: 'Infrastructure' } })
};
