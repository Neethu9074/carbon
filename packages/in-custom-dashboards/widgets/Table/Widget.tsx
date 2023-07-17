/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TableOverview from 'in-custom-dashboards/widgets/Table/eventsTable/TablePresenter';

interface TableOverviewWidgetProps {
  config: any;
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
  config = { ...config, source: 'events' }; // This need to be removed once config is configured
  if (config.source === 'events') {
    return (
      <TableOverview title={title} config={config} actions={actions} dragHandle={dragHandle} isPreview={isPreview} />
    );
  }
  return <></>;
}
