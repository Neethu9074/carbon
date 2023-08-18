/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import InfrastructureTableWidget from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget';
import TableOverview from 'in-custom-dashboards/widgets/Table/eventsTable/TablePresenter';
import { TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import { dataSources } from 'in-custom-dashboards/widgets/Table/index';

export default function TableOverviewWidget({ config, ...props }: TableWidgetProps) {
  if (config.source === dataSources.INFRA.type) {
    return <InfrastructureTableWidget config={config} {...props} />;
  }

  if (config.source === dataSources.EVENTS.type) {
    return <TableOverview config={config} {...props} />;
  }

  return null;
}
