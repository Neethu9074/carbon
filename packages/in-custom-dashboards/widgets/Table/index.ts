/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { metrics as infraMetrics } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure';
import { customWidgetTableInfraDataSourceEnabled } from 'in-services/featureFlags';
import { customWidgetEventsTableEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export { default as ShowCaseComponent } from 'in-custom-dashboards/widgets/Table/eventsTable/ShowCase';

export { default as Widget } from 'in-custom-dashboards/widgets/Table/Widget';

export { createForm } from 'in-custom-dashboards/widgets/Table/form';

export { default as Form } from 'in-custom-dashboards/widgets/Table/FormComponent';

interface DataSourceProps {
  [key: string]: { type: string; label: string; isEnabled: boolean };
}

export const type = 'table';
export const label = 'Table';
export const minimumWidth = 6;
export const minimumHeight = 18;
export const enabled = customWidgetEventsTableEnabled || customWidgetTableInfraDataSourceEnabled;

export const dataSources: DataSourceProps = {
  EVENTS: {
    type: 'EventsTable',
    label: t('in-custom-dashboards:widgets.table.dataSource.events'),
    isEnabled: customWidgetEventsTableEnabled
  },
  INFRA: {
    type: infraMetrics.source,
    label: infraMetrics.label,
    isEnabled: customWidgetTableInfraDataSourceEnabled
  },
  KUBERNETES_EVENTS: {
    type: 'KubernetesEventsTable',
    label: t('in-custom-dashboards:widgets.table.dataSource.k8sEvents'),
    isEnabled: true
  }
};
