/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useRef, useState, useCallback, useMemo } from 'react';

import { DismissibleTag, OperationalTag, Button, Popover, PopoverContent } from '@instana/carbon';

import type {
  ColumnFilter,
  FilterState,
  Tag,
  TagFiltersProps,
  UseTagFiltersParams
} from 'in-synthetics/utils/constants';
import useIsOverflow from 'in-hooks/useIsOverflow';
import { t } from 'in-i18n';

import locals from './TagFilters.mless';

// Helper function to map column filters to the filter state format
export function mapColumnFiltersToFilterState(columnFilters: ColumnFilter[]): FilterState {
  // Initialize with empty arrays for all filter types
  const filterState: FilterState = {
    syntheticTypes: [],
    locationIds: [],
    entityIds: [],
    applicationIds: []
  };

  // Map each column filter to the appropriate property in the filter state
  for (const filter of columnFilters) {
    switch (filter.id) {
      case 'type':
        filterState.syntheticTypes = filter.value!;
        break;
      case 'location':
        filterState.locationIds = filter.value!;
        break;
      case 'association':
        filterState.entityIds = filter.value;
        break;
      case 'application':
        filterState.applicationIds = filter.value;
        break;
    }
  }

  return filterState;
}

function useTagFilters({ columnFilters, setColumnFilters, getFilterLabel, setFilter }: UseTagFiltersParams) {
  const createTagRemoveHandler = useCallback(
    (id: string, filterArray: string[], val: string) => () => {
      const updatedValue = filterArray.filter(v => v !== val);
      const newFilters = updatedValue.length
        ? [...columnFilters.filter(f => f.id !== id), { id, value: updatedValue }]
        : columnFilters.filter(f => f.id !== id);

      // Map the column filters to the appropriate format for setFilter
      const mappedFilters = mapColumnFiltersToFilterState(newFilters);

      setColumnFilters(newFilters);
      setFilter(mappedFilters);
    },
    [columnFilters, setColumnFilters, setFilter]
  );

  return useMemo(() => {
    // Create a map to hold tags by category
    const tagsByCategory: Record<string, Tag[]> = {
      types: [],
      locations: [],
      associations: [],
      applications: []
    };

    // First, organize tags by their category
    for (const col of columnFilters) {
      const id = col.id;
      const filterArray = col.value as string[];

      if (!filterArray?.length) continue;

      for (const val of filterArray) {
        const tag = {
          id: `${id}-${val}`,
          label: getFilterLabel({ id, value: val }),
          onClose: createTagRemoveHandler(id, filterArray, val),
          category: id
        };

        // Add to the appropriate category array
        tagsByCategory[id] = tagsByCategory[id] || [];
        tagsByCategory[id].push(tag);
      }
    }

    // Define the order of categories
    const categoryOrder = ['type', 'location', 'association', 'application'];

    // Combine all tags in the specified order
    const tags = categoryOrder.flatMap(category => tagsByCategory[category] || []);

    return tags;
  }, [columnFilters, getFilterLabel, createTagRemoveHandler]);
}

const TagList = React.memo(({ tags }: { tags: Tag[] }) => (
  <>
    {tags.map(tag => (
      <DismissibleTag key={tag.id} text={tag.label} onClose={tag.onClose} />
    ))}
  </>
));

export default function TagFilters({
  columnFilters,
  setColumnFilters,
  resetFilters,
  getFilterLabel,
  setFilter
}: TagFiltersProps) {
  const filterSummaryRef = useRef<HTMLDivElement>(null);
  const measureTagRef = useRef<HTMLDivElement>(null);
  const overflowTagRef = useRef<HTMLDivElement>(null);
  const [operationalPopover, setOperationalPopover] = useState(false);

  const { displayCount } = useIsOverflow({
    ref: filterSummaryRef,
    measureRef: measureTagRef,
    measurementOffset: 106,
    overflowTag: overflowTagRef,
    maxVisibleCount: 5
  });

  const tagFilters = useTagFilters({
    columnFilters,
    setColumnFilters,
    getFilterLabel,
    setFilter
  });

  if (!tagFilters.length) return null;

  // Split tags into visible and overflow groups
  const visibleTags = tagFilters.slice(0, displayCount);
  const overflowTags = tagFilters.slice(displayCount);
  const hasOverflow = overflowTags.length > 0;

  // Toggle popover handler
  const togglePopover = () => setOperationalPopover(prev => !prev);

  return (
    <div id="tag-filter-summary" className={locals.filterSummary} ref={filterSummaryRef}>
      <div className={locals.measureTags} aria-hidden ref={measureTagRef}>
        <TagList tags={tagFilters} />
      </div>
      <div className={locals.filterSummaryTagOverflowWrapper}>
        <TagList tags={visibleTags} />
        {hasOverflow && (
          <Popover open={operationalPopover} isTabTip caret onRequestClose={togglePopover} ref={overflowTagRef}>
            <OperationalTag text={`+${overflowTags.length}`} onClick={togglePopover} />
            <PopoverContent>
              <div className={locals.filterOverflowPopover}>
                <TagList tags={overflowTags} />
              </div>
            </PopoverContent>
          </Popover>
        )}
        <div className={locals.clearButtonWrapper}>
          <Button kind="ghost" onClick={resetFilters}>
            {t('in-synthetics:dashboard.testList.tagFilter.clearFilters')}
          </Button>
        </div>
      </div>
    </div>
  );
}
