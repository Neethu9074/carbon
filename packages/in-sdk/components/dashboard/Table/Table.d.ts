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
}

declare function TableComponent(props: TableProps): JSX.Element;

export default TableComponent;
