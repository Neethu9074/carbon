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
  initialSortDirection?: string;
  distanceBetweenDatapointsInMillis?: number;
  rightHeader?: JSX.Element;
  /**
   * The actual data required for the CSVExporter is sourced from the Table file.
   * This optional property will be rendered inside of he top-right header.
   * Ideally it could be a Button
   */
  CSVExportButton?: (props: { csvHeaders: Record<string, any>[]; csvData: Record<string, any>[] }) => React.ReactNode;
}

declare function TableComponent(props: TableProps): JSX.Element;

export default TableComponent;
