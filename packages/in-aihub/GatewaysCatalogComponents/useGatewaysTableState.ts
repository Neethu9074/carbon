/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useState, useMemo } from 'react';

import { Gateway } from 'in-aihub/GatewaysCatalogComponents/useGatewaysData';

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
  csvRows: Gateway[];
};

export interface FilterConfig {
  columnName: string;
  options: string[];
}

export interface UseGatewaysTableStateOptions {
  initialRows: Gateway[];
  initialHeaders: TableHeader[];
  filterConfigs?: FilterConfig[];
  handleRowClick?: (row: Gateway) => void;
}

export interface GatewaysTableState {
  tableId: string;
  // Data
  rows: Gateway[];
  headers: TableHeader[];

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  pageSizes: number[];
  totalItems: number;
  paginatedRows: Gateway[];

  // Sorting
  sortKey: string;
  sortDirection: string;
  handleHeaderClick: (key: string) => void;

  // Searching
  searchTerm: string;
  handleSearchChange: (term: string) => void;

  // Filtering
  filterConfigs: FilterConfig[];
  selectedFilters: Record<string, string[]>;
  handleFilterChange: (columnName: string, filters: string[]) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;

  // CSV Export
  csvData: CSVData;

  // Row click
  handleRowClick?: (row: Gateway) => void;
}

export const useGatewaysTableState = ({
  initialRows,
  initialHeaders,
  filterConfigs = [],
  handleRowClick
}: UseGatewaysTableStateOptions): GatewaysTableState => {
  // Generate random id for each table instance created
  const tableId = useMemo(() => `gateways-table-${Math.random().toString(36).substring(2, 10)}`, []);

  // Data
  const rows = initialRows;
  const headers = initialHeaders;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sorting
  const [sortKey, setSortKey] = useState(headers?.[0]?.key || '');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Searching
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering - now using a record to store filters for multiple columns
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

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

  const handleFilterChange = (columnName: string, filters: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [columnName]: filters
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(selectedFilters).some(filters => filters.length > 0);
  }, [selectedFilters]);

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

  // Apply filter selections for all filter columns
  const filteredRows = useMemo(() => {
    if (!hasActiveFilters) {
      return searchFilteredRows;
    }

    return searchFilteredRows.filter(row => {
      // Check if the row passes all active filters
      return Object.entries(selectedFilters).every(([columnName, selectedValues]) => {
        // If no filters selected for this column, pass the filter
        if (!selectedValues.length) return true;

        const columnValue = row[columnName as keyof Gateway];

        // For capability filtering, we need to check if any of the gateway's capabilities
        // match any of the selected capabilities
        if (columnName === 'capabilities' && Array.isArray(columnValue)) {
          return selectedValues.some(selectedCapability => (columnValue as string[]).includes(selectedCapability));
        }

        // For regular string columns
        return selectedValues.includes(columnValue as string);
      });
    });
  }, [searchFilteredRows, selectedFilters, hasActiveFilters]);

  // Apply sorting
  const sortedFilteredRows = useMemo(() => {
    if (!sortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
      const lhs = a[sortKey as keyof Gateway] || '';
      const rhs = b[sortKey as keyof Gateway] || '';

      if (sortDirection === 'ASC') {
        return collator.compare(String(lhs), String(rhs));
      } else {
        return collator.compare(String(rhs), String(lhs));
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
    filterConfigs,
    selectedFilters,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,

    // CSV Export
    csvData,

    // Row click
    handleRowClick
  };
};
