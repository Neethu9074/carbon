/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

interface TableProps {
  cols: Array;
  rows: Array;
  cardTitle: string;
  withoutPadding: boolean;
  getRowDetails?: (any) => JSX.Element;
  maxItemsPerPage?: number;
  initialSortColumn?: number;
  disableSorting?: boolean;
  showExpandAll?: boolean;
  initialSortDirection?: string;
  distanceBetweenDatapointsInMillis?: number;
  // workaround in 288 as a quick way to force using the legacy table
  // when it won't work with carbon table, yet: Expandable rows
  // this should not be used and necessary in release-289 and later.
  forceUsingLegacyTable?: boolean;
}

declare function TableComponent(props: TableProps): JSX.Element;

export default TableComponent;
