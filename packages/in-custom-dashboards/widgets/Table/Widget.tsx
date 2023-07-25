/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfrastructureTableWidget } from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget';
import TableOverview from 'in-custom-dashboards/widgets/Table/eventsTable/TablePresenter';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';

interface TableOverviewWidgetProps {
  config: {
    [key: string]: any;
    source: string;
  };
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  isPreview: boolean;
}

export default function TableOverviewWidget({
  config,
  title,
  actions,
  dragHandle,
  isPreview
}: TableOverviewWidgetProps) {
  if (config.source === dataSources.INFRA.type) {
    return <InfrastructureTableWidget title={title} config={config} actions={actions} dragHandle={dragHandle} />;
  }

  if (config.source === dataSources.EVENTS.type) {
    return (
      <TableOverview title={title} config={config} actions={actions} dragHandle={dragHandle} isPreview={isPreview} />
    );
  }

  return null;
}
