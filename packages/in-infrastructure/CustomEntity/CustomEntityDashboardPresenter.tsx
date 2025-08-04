/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CustomDashboard } from '@instana/types';

//@ts-expect-error TS migration
import Grid from 'in-custom-dashboards/CustomDashboard/Grid/Grid';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';

interface DashboardPresenterProps {
  dashboardConfig: any;
  onLayoutChange?(config: CustomDashboard, setConfig: React.Dispatch<any>, changes: any): any;
  onEditWidget(id: string): void;
}

export default function CustomEntityDashboardPreseter({
  dashboardConfig,
  onLayoutChange,
  onEditWidget
}: DashboardPresenterProps) {
  const { width, ref } = useResizeObserverCustom<HTMLDivElement>();
  return (
    <div ref={ref}>
      {dashboardConfig && (
        <Grid width={width} config={dashboardConfig} onLayoutChange={onLayoutChange} onEditWidget={onEditWidget} />
      )}
    </div>
  );
}
