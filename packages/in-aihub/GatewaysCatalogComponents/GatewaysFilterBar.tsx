/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button, Tag } from '@instana/carbon';

import TableFilterPopover, { FilterOption } from 'in-aihub/GatewaysCatalogComponents/TableFilterPopover';
import { t } from 'in-i18n';

import locals from './GatewaysFilterBar.mless';

interface FilterConfig {
  columnName: string;
  options: Array<string | FilterOption>;
}

interface GatewaysFilterBarProps {
  filterConfigs: FilterConfig[];
  selectedFilters: Record<string, string[]>;
  handleFilterChange: (columnName: string, filters: string[]) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  tableId: string;
}

export default function GatewaysFilterBar({
  filterConfigs,
  selectedFilters,
  handleFilterChange,
  clearAllFilters,
  hasActiveFilters,
  tableId
}: GatewaysFilterBarProps) {
  // Get filter labels for display in tags
  const getFilterLabel = (columnName: string, value: string): string => {
    const config = filterConfigs.find(config => config.columnName === columnName);
    if (!config) return value;

    // If the filter option is an object with label/value, find the label
    const option = config.options.find(opt => {
      if (typeof opt === 'string') return opt === value;
      return (opt as FilterOption).value === value;
    });

    if (typeof option === 'string') return option;
    return (option as FilterOption)?.label || value;
  };

  // Get column display name
  const getColumnDisplayName = (columnName: string): string => {
    switch (columnName) {
      case 'aiModel':
        return t('in-aihub:gateways.filterByModel');
      case 'capabilities':
        return t('in-aihub:gateways.filterByCapability');
      default:
        return columnName;
    }
  };

  return (
    <div className={locals['table-filter-popover']}>
      {/* Filter popovers */}
      {filterConfigs.map(config => (
        <div key={config.columnName} className={locals['filter-popover-item']}>
          <TableFilterPopover
            filterOptions={config.options as FilterOption[]}
            filterLabel={getColumnDisplayName(config.columnName)}
            onApplyFilter={handleFilterChange}
            onResetFilter={clearAllFilters}
            selectedValues={selectedFilters[config.columnName] || []}
            tableId={tableId}
            columnName={config.columnName}
          />
        </div>
      ))}

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className={locals['filter-tags-container']}>
          {Object.entries(selectedFilters).map(([columnName, values]) =>
            values.map(value => (
              <div key={`${columnName}-${value}`} className={locals['filter-tag-item']}>
                <Tag
                  type="blue"
                  size="sm"
                  onClose={() => {
                    // Remove this specific filter
                    const newValues = selectedFilters[columnName].filter(v => v !== value);
                    handleFilterChange(columnName, newValues);
                  }}
                >
                  {`${getColumnDisplayName(columnName)}: ${getFilterLabel(columnName, value)}`}
                </Tag>
              </div>
            ))
          )}

          {/* Clear all filters button */}
          <div className={locals['clear-filters-button']}>
            <Button size="sm" kind="ghost" onClick={clearAllFilters}>
              {t('in-aihub:gateways.clearFilters')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
