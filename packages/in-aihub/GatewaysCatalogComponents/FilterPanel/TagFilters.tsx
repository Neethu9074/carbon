/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useRef, useState, useMemo } from 'react';

import { DismissibleTag, OperationalTag, Button, Popover, PopoverContent } from '@instana/carbon';
import { generateStableHash } from '@instana/utils';

import useIsOverflow from 'in-hooks/useIsOverflow';
import { t } from 'in-i18n';

import locals from './TagFilters.mless';

interface TagFilter {
  id: string;
  label: string;
  onClose: () => void;
}

interface TagFiltersProps {
  selectedModelFilters: string[];
  selectedCapabilityFilters: string[];
  capabilityOptions: Array<{ value: string; label: string }>;
  modelOptions?: Array<{ value: string; label: string }>;
  clearAllFilters: () => void;
  onModelFilterChange: (values: string[]) => void;
  onCapabilityFilterChange: (values: string[]) => void;
}

export default function TagFilters({
  selectedModelFilters,
  selectedCapabilityFilters,
  capabilityOptions,
  modelOptions = [],
  clearAllFilters,
  onModelFilterChange,
  onCapabilityFilterChange
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

  // Create stable hashes for dependency arrays
  const modelFiltersHash = useMemo(() => generateStableHash(selectedModelFilters), [selectedModelFilters]);
  const capabilityFiltersHash = useMemo(
    () => generateStableHash(selectedCapabilityFilters),
    [selectedCapabilityFilters]
  );

  // Create tag filters from selected filters
  const tagFilters = useMemo(() => {
    const filters: TagFilter[] = [];

    // Add model filters
    selectedModelFilters.forEach(model => {
      const modelLabel = modelOptions.find(opt => opt.value === model)?.label || model;
      filters.push({
        id: `model-${model}`,
        label: `${t('in-aihub:gateways.filterByModel')}: ${modelLabel}`,
        onClose: () => {
          onModelFilterChange(selectedModelFilters.filter(m => m !== model));
        }
      });
    });

    // Add capability filters
    selectedCapabilityFilters.forEach(capability => {
      const capabilityLabel = capabilityOptions.find(opt => opt.value === capability)?.label || capability;
      filters.push({
        id: `capability-${capability}`,
        label: `${t('in-aihub:gateways.filterByCapability')}: ${capabilityLabel}`,
        onClose: () => {
          onCapabilityFilterChange(selectedCapabilityFilters.filter(c => c !== capability));
        }
      });
    });

    return filters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelFiltersHash, capabilityFiltersHash, capabilityOptions, modelOptions]);

  if (!tagFilters.length) return null;

  return (
    <div className={locals['filter--summary']} ref={filterSummaryRef}>
      <div className={locals['measure-tags']} aria-hidden ref={measureTagRef}>
        {tagFilters.map(t => (
          <DismissibleTag text={t.label} onClose={t.onClose} key={t.id} />
        ))}
      </div>
      <div className={locals['filter--summary-tag-and-overflow-wrapper']}>
        {tagFilters.slice(0, displayCount).map(t => (
          <DismissibleTag text={t.label} onClose={t.onClose} key={t.id} />
        ))}
        {displayCount < tagFilters.length && (
          <Popover
            open={operationalPopover}
            align="bottom-right"
            isTabTip
            caret
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
                  <DismissibleTag key={t.id} text={t.label} onClose={t.onClose} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <Button kind="ghost" onClick={clearAllFilters}>
        {t('in-aihub:gateways.clearFilters')}
      </Button>
    </div>
  );
}
