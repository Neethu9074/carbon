/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useRef, useState } from 'react';
import { ColumnFilter } from '@tanstack/react-table';

import { DismissibleTag, OperationalTag, Button, Popover, PopoverContent } from '@instana/carbon';
import { generateStableHash } from '@instana/utils';

import useIsOverflow from 'in-hooks/useIsOverflow';
import { t } from 'in-i18n';

import locals from './TagFilters.mless';

interface UseTagFiltersParams {
  columnFilters: ColumnFilter[];
  setColumnFilters: (change: ColumnFilter[]) => void;
  getFilterLabel: ({ id, value }: { value: string; id: string }) => string;
}

function useTagFilters({ columnFilters, setColumnFilters, getFilterLabel }: UseTagFiltersParams) {
  return useMemo(() => {
    const buildTag = (col: ColumnFilter) => {
      const id = col.id;
      const value = col.value;

      if (Array.isArray(value)) {
        return value.map(val => ({
          id: `${id}-${val}`,
          label: getFilterLabel({ id, value: val }),
          onClose: () => {
            const updatedValue = value.filter(v => v !== val);
            const newFilters = updatedValue.length
              ? [...columnFilters.filter(f => f.id !== id), { id: id, value: updatedValue }]
              : columnFilters.filter(f => f.id !== id);

            setColumnFilters(newFilters);
          }
        }));
      }

      return [
        {
          id: `${id}-${value}`,
          label: getFilterLabel({ id, value: value as string }),
          onClose: () => {
            const newFilters = columnFilters.filter(f => f.id !== id);
            setColumnFilters(newFilters);
          }
        }
      ];
    };

    return columnFilters.flatMap(buildTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash(columnFilters), setColumnFilters, getFilterLabel]);
}

export default function TagFilters({
  columnFilters,
  setColumnFilters,
  resetFilters,
  getFilterLabel
}: {
  columnFilters: ColumnFilter[];
  setColumnFilters: (change: ColumnFilter[]) => void;
  resetFilters: () => void;
  getFilterLabel: ({ id, value }: { value: string; id: string }) => string;
}) {
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

  const tagFilters = useTagFilters({
    columnFilters,
    setColumnFilters,
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
