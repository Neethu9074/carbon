/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
  showHeader?: boolean;
  initialSortDirection?: string;
  rightHeader?: JSX.Element;
}

declare function TableComponent(props: TableProps): JSX.Element;

export default TableComponent;
