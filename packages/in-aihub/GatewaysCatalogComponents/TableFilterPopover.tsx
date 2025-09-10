/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Filter } from '@carbon/icons-react';
import React, { useState } from 'react';

import { Button, Checkbox, IconButton, Popover, PopoverContent } from '@instana/carbon';

import { t } from 'in-i18n';

import locals from './TableFilterPopover.mless';

export interface FilterOption {
  value: string;
  label: string;
}

interface TableFilterPopoverProps {
  filterOptions: string[] | FilterOption[];
  filterLabel?: string;
  onApplyFilter: (columnName: string, selectedValues: string[]) => void;
  onResetFilter: () => void;
  selectedValues: string[];
  tableId: string;
  columnName: string;
}

function TableFilterPopover({
  filterOptions,
  filterLabel = 'Filter',
  onApplyFilter,
  onResetFilter,
  selectedValues,
  tableId,
  columnName
}: TableFilterPopoverProps): React.ReactElement {
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (value: string) => {
    setLocalSelectedValues(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleApply = () => {
    onApplyFilter(columnName, localSelectedValues);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalSelectedValues([]);
    onResetFilter();
    setIsOpen(false);
  };

  const normalizedOptions: FilterOption[] = filterOptions.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return option;
  });

  return (
    <Popover
      open={isOpen}
      onChange={() => {
        // Toggle the popover state when the trigger is clicked
        setIsOpen(!isOpen);
      }}
    >
      <IconButton
        label={t('in-aihub:gateways.filter')}
        className={selectedValues.length > 0 ? 'active-filter' : ''}
        id={`filter-button-${tableId}-${columnName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter />
      </IconButton>
      <PopoverContent>
        <div className={locals['popover-content']}>
          <div className={locals['filter-label']}>{filterLabel}</div>
          <div className={locals['options-container']}>
            {normalizedOptions.map(option => (
              <Checkbox
                key={option.value}
                id={`${tableId}-filter-${columnName}-${option.value}`}
                labelText={option.label}
                checked={localSelectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
              />
            ))}
          </div>
          <div className={locals['button-container']}>
            <Button size="sm" kind="secondary" onClick={handleReset}>
              {t('in-aihub:gateways.reset')}
            </Button>
            <Button size="sm" onClick={handleApply}>
              {t('in-aihub:gateways.apply')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TableFilterPopover;
