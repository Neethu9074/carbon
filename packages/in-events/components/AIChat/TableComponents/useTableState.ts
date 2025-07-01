/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useState, useMemo } from 'react';

import { FilterOption } from 'in-events/components/AIChat/TableComponents/TableFilterPopover';

export interface TableRow {
  id: string;
  [key: string]: any;
}

export interface TableHeader {
  key: string;
  header: string;
}

export type CSVHeader = {
  label: string;
  key: string;
};

export type CSVData = {
  csvHeaders: CSVHeader[];
  csvRows: TableRow[];
};

export interface UseTableStateOptions {
  initialRows: TableRow[];
  initialHeaders: TableHeader[];
  filterOptions?: FilterOption[];
  filterColumnName?: string;
  handleRowClick?: (row: any) => void;
}

export interface TableState {
  tableId: string;
  // Data
  rows: TableRow[];
  headers: TableHeader[];

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizes: number[];
  totalItems: number;
  paginatedRows: TableRow[];

  // Sorting
  sortKey: string;
  sortDirection: string;
  handleHeaderClick: (key: string) => void;

  // Searching
  searchTerm: string;
  handleSearchChange: (term: string) => void;

  // Filtering
  filterOptions: FilterOption[];
  selectedFilters: string[];
  handleFilterChange: (filters: string[]) => void;
  filterColumnName?: string;
  // CSV Export
  csvData: CSVData;

  //rowClick
  handleRowClick?: (row: any) => void;
}

export const useTableState = ({
  initialRows,
  initialHeaders,
  filterOptions = [],
  filterColumnName,
  handleRowClick
}: UseTableStateOptions): TableState => {
  //Generate random id for each table instance created
  const tableId = useMemo(() => `table-${Math.random().toString(36).substring(2, 10)}`, []);

  // Data
  const rows = initialRows.map(row => {
    return { ...row, id: `${tableId}-${row.id}` } as TableRow;
  });
  const headers = initialHeaders;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Sorting
  const [sortKey, setSortKey] = useState(headers?.[0]?.key || '');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Searching
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Event handlers
  const handleHeaderClick = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortKey(key);
      setSortDirection('DESC');
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
    setCurrentPage(1);
  };

  // Apply search filter
  const searchFilteredRows = useMemo(() => {
    if (!searchTerm) {
      return rows;
    }

    return rows.filter(row => {
      return Object.values(row).some(
        value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, rows]);

  // Apply filter selections
  const filteredRows = useMemo(() => {
    if (!selectedFilters.length || !filterColumnName) {
      return searchFilteredRows;
    }

    return searchFilteredRows.filter(row => {
      const columnValue = row[filterColumnName];
      return selectedFilters.includes(columnValue);
    });
  }, [searchFilteredRows, selectedFilters, filterColumnName]);

  //Apply sorting
  const sortedFilteredRows = useMemo(() => {
    if (!sortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
      const lhs = a[sortKey] || '';
      const rhs = b[sortKey] || '';

      if (sortDirection === 'ASC') {
        return collator.compare(lhs, rhs);
      } else {
        return collator.compare(rhs, lhs);
      }
    });
  }, [filteredRows, sortKey, sortDirection]);

  const pageSizes = [5, 10, 15, 20];

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedFilteredRows.slice(startIndex, endIndex);
  }, [sortedFilteredRows, currentPage, pageSize]);

  // CSV data
  const csvData = useMemo(
    () => ({
      csvHeaders: headers.map(header => ({ label: header.header, key: header.key })),
      csvRows: sortedFilteredRows
    }),
    [headers, sortedFilteredRows]
  );

  const totalItems = filteredRows.length;

  return {
    tableId,
    // Data
    rows,
    headers,

    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    pageSizes,
    totalItems,
    paginatedRows,

    // Sorting
    sortKey,
    sortDirection,
    handleHeaderClick,

    // Searching
    searchTerm,
    handleSearchChange,

    // Filtering
    filterOptions,
    selectedFilters,
    handleFilterChange,
    filterColumnName,

    // CSV Export
    csvData,

    //Row click
    handleRowClick
  };
};
