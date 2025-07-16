/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { Popover, PopoverContent, Button, Checkbox, Layer, IconButton } from '@carbon/react';
import React, { ChangeEvent, useState } from 'react';
import { Filter } from '@carbon/icons-react';
import classNames from 'classnames';

import { t } from 'in-i18n';

import locals from './TableFilterPopover.mless';

export type PopoverAlignment =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start';

export interface FilterOption {
  value: string;
  text: string;
}

interface TableFilterPopoverProps {
  /**
   * Specify how the popover should align with the trigger element
   */
  align?: PopoverAlignment;

  /**
   * Provide an optional class name for the toolbar filter
   */
  className?: string;

  /**
   * Filter options to display as checkboxes
   */
  filterOptions?: FilterOption[];

  /**
   * Label for the filter options
   */
  filterLabel?: string;

  /**
   * Provide an optional hook that is called each time the input is updated
   */
  onChange?: (event: '' | ChangeEvent<HTMLInputElement>) => void;

  /**
   * Provide an function that is called when the apply button is clicked
   */
  onApplyFilter?: (selectedCheckboxes: Array<string>) => void;

  /**
   * Provide an function that is called when the reset button is clicked
   */
  onResetFilter?: () => void;

  /**
   * Currently selected filter values
   */
  selectedValues?: string[];

  /**
   * The table id to make the filter component unique amongst multiple tables with repeated data
   */
  tableId: string;
}

const TableFilterPopover = ({
  align = 'bottom-end',
  onApplyFilter,
  onResetFilter,
  className,
  filterOptions = [],
  filterLabel = t('in-events:aichat.group'),
  selectedValues = [],
  tableId
}: TableFilterPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>(selectedValues);

  const prefix = `cds`;

  const toolbarActionClasses = classNames(className, `${prefix}--toolbar-action ${prefix}--overflow-menu`);

  const handleApplyFilter = () => {
    setIsOpen(false);
    if (onApplyFilter) {
      onApplyFilter(selectedCheckboxes);
    }
  };

  const handleResetFilter = () => {
    setIsOpen(false);
    setSelectedCheckboxes([]);
    if (onResetFilter) {
      onResetFilter();
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkboxId = e.target.id;
    const isChecked = e.target.checked;
    // Extract index from the checkbox ID (format: "filter-{index}")
    const index = parseInt(checkboxId.split('-')[1], 10);
    const checkboxValue = filterOptions[index]?.value || '';

    if (isChecked) {
      setSelectedCheckboxes([...selectedCheckboxes, checkboxValue]);
    } else {
      setSelectedCheckboxes(selectedCheckboxes.filter(item => item !== checkboxValue));
    }
  };

  // Don't render the filter if there are no options
  if (filterOptions.length === 0) {
    return null;
  }

  return (
    <Layer>
      <Popover open={isOpen} isTabTip onRequestClose={() => setIsOpen(false)} align={align}>
        <IconButton
          kind="ghost"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={toolbarActionClasses}
          label={t('in-events:aichat.filtering')}
        >
          <Filter />
        </IconButton>
        <PopoverContent
          id={`toolbar-filter-popover-${tableId}`}
          className={classNames(`${prefix}--filter-popover-content`, locals.filterPopoverContent)}
        >
          <div className={classNames(`${prefix}--container-checkbox`, locals.filterPopoverBody)}>
            <fieldset className={`${prefix}--fieldset`}>
              <legend className={classNames(`${prefix}--label`, locals.labelStyle)}>{filterLabel}</legend>
              <div className={locals.filterOptionsContainer}>
                {filterOptions.map((option, index) => (
                  <Checkbox
                    key={`filter-${index}-${tableId}`}
                    labelText={option.text}
                    id={`filter-${index}-${tableId}`}
                    onChange={handleCheckboxChange}
                    checked={selectedCheckboxes.includes(option.value)}
                  />
                ))}
              </div>
            </fieldset>
          </div>
          <div className={classNames(`${prefix}--filter-actions`, locals.filterActions)}>
            <Button
              kind="secondary"
              title={t('in-events:aichat.resetFilters')}
              onClick={handleResetFilter}
              className={locals.resetButton}
              id={`reset-btn-${tableId}`}
            >
              {t('in-events:aichat.resetFilters')}
            </Button>
            <Button
              kind="primary"
              title={t('in-events:aichat.applyFilter')}
              onClick={handleApplyFilter}
              className={locals.applyButton}
              id={`apply-btn-${tableId}`}
            >
              {t('in-events:aichat.applyFilter')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Layer>
  );
};

export default TableFilterPopover;
