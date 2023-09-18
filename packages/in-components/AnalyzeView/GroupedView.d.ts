/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Group, IngestionOffsetCursor } from '@instana/types/typeDefinitions';
import { Observable } from '@instana/observables';

import { GroupedLogsProps } from 'in-logging/analyze/AnalyzeView/components/GroupedLogs';
import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { AxisColor } from 'in-components/Chart/types';

export interface GroupedViewProps extends GroupedLogsProps {
  getColor?: (item: any, i: number, groupBy: Group) => AxisColor;
  columnDefinitions: ColumnDefinition[];
  getData: (params: {
    timeConfig: TimeConfig;
    backendQueryModel: TagFilterExpression;
    groupBy: Group;
    cursor: IngestionOffsetCursor;
  }) => Observable<unknown>;
  iconMap: Map;
  UngroupedView: (props: UngroupedViewProps) => JSX.Element;
  withoutSorting: boolean;
  itemlabelColumnId: string;
}

declare const GroupedView: (props: GroupedViewProps) => JSX.Element;

export default GroupedView;
