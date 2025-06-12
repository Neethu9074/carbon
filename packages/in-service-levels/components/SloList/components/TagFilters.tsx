/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ColumnFilter } from '@tanstack/react-table';
import React, { useRef, useState } from 'react';

import { DismissibleTag, OperationalTag, Button, Popover, PopoverContent } from '@instana/carbon';

import { SloListFilterState } from 'in-service-levels/hooks/useSloListFilterUrlState';
import useTagFilters from 'in-service-levels/components/SloList/hooks/useTagFilters';
import useIsOverflow from 'in-hooks/useIsOverflow';
import { t } from 'in-i18n';

import locals from './TagFilters.mless';

interface TagFiltersProps {
  filters: SloListFilterState;
  setLocalFilters: (change: ColumnFilter[]) => void;
  setFilterFromColumnFilters: (columnFilter: ColumnFilter[]) => void;
  resetFilters: () => void;
  getFilterLabel: ({ id, value }: { value: string | string[]; id: string }) => string;
}

export default function TagFilters({
  filters,
  setLocalFilters,
  setFilterFromColumnFilters,
  resetFilters,
  getFilterLabel
}: TagFiltersProps) {
  const filterSummaryRef = useRef<HTMLDivElement>(null);
  const measureTagRef = useRef<HTMLDivElement>(null);
  const overflowTagRef = useRef<HTMLDivElement>(null);
  const [operationalPopover, setOperationalPopover] = useState(false);

  const { displayCount } = useIsOverflow({
    ref: filterSummaryRef,
    measureRef: measureTagRef,
    measurementOffset: 106,
    overflowTag: overflowTagRef
  });

  const columnFilters = Object.entries(filters)
    .filter(([_, value]) => value && value.length > 0)
    .map(([id, value]) => ({
      id,
      value
    }));

  const tagFilters = useTagFilters({
    columnFilters,
    setLocalFilters,
    setFilter: setFilterFromColumnFilters,
    getFilterLabel
  });

  if (!tagFilters.length) return null;

  return (
    <div className={locals['filter--summary']} ref={filterSummaryRef}>
      <div className={locals['measure-tags']} aria-hidden ref={measureTagRef}>
        {tagFilters.map(t => (
          <DismissibleTag text={t.label} onClose={t.onClose} key={t.label} />
        ))}
      </div>
      <div className={locals['filter--summary-tag-and-overflow-wrapper']}>
        {tagFilters.slice(0, displayCount).map(t => (
          <DismissibleTag text={t.label} onClose={t.onClose} key={t.label} />
        ))}
        {displayCount < tagFilters.length && (
          <Popover
            open={operationalPopover}
            align="bottom-right"
            autoAlign
            isTabTip
            onRequestClose={() => setOperationalPopover(prev => !prev)}
            ref={overflowTagRef}
          >
            <OperationalTag
              text={`+${tagFilters.length - displayCount}`}
              onClick={() => setOperationalPopover(prev => !prev)}
            />
            <PopoverContent>
              <div className={locals['filter-overflow-popover']}>
                {tagFilters.slice(displayCount).map(t => (
                  <DismissibleTag key={t.label} text={t.label} onClose={t.onClose} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Button kind="ghost" onClick={resetFilters}>
        {t('in-service-levels:general.filtering.clearFilters')}
      </Button>
    </div>
  );
}
