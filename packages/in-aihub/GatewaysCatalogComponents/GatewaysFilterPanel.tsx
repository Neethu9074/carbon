/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useCallback, useMemo } from 'react';

import { Accordion, AccordionItem, DismissibleTag, Stack } from '@instana/carbon';

import { FilterCheckboxList, FilterOption } from 'in-aihub/GatewaysCatalogComponents/FilterCheckboxList';
import { t } from 'in-i18n';

export interface FilterConfig {
  id: string;
  title: string;
  isOpen: boolean;
  selectedOptions: string[];
  options: Array<string | FilterOption>;
}

export interface GatewaysFilterPanelProps {
  modelOptions: Array<string | FilterOption>;
  capabilityOptions: Array<string | FilterOption>;
  selectedModelFilters: string[];
  selectedCapabilityFilters: string[];
  onModelFilterChange: (values: string[]) => void;
  onCapabilityFilterChange: (values: string[]) => void;
}

/**
 * GatewaysFilterPanel component renders filter accordions for gateways list
 */
export default function GatewaysFilterPanel({
  modelOptions,
  capabilityOptions,
  selectedModelFilters,
  selectedCapabilityFilters,
  onModelFilterChange,
  onCapabilityFilterChange
}: GatewaysFilterPanelProps) {
  // Track open/closed state of filter accordions
  const [isFilterOpen, setIsFilterOpen] = useState<Record<string, boolean>>({
    model: selectedModelFilters.length > 0,
    capability: selectedCapabilityFilters.length > 0
  });

  // Handler for accordion heading click
  const handleAccordionHeadingClick = useCallback((filterId: string) => {
    setIsFilterOpen(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  }, []);

  // Generate filter configurations
  const filterConfigs = useMemo((): FilterConfig[] => {
    return [
      {
        id: 'model',
        title: t('in-aihub:gateways.filterByModel'),
        isOpen: isFilterOpen.model,
        selectedOptions: selectedModelFilters,
        options: modelOptions
      },
      {
        id: 'capability',
        title: t('in-aihub:gateways.filterByCapability'),
        isOpen: isFilterOpen.capability,
        selectedOptions: selectedCapabilityFilters,
        options: capabilityOptions
      }
    ];
  }, [isFilterOpen, selectedModelFilters, selectedCapabilityFilters, modelOptions, capabilityOptions]);

  // Handler for clearing filter values
  const handleClearFilter = useCallback(
    (filterId: string) => {
      if (filterId === 'model') {
        onModelFilterChange([]);
      } else if (filterId === 'capability') {
        onCapabilityFilterChange([]);
      }
    },
    [onModelFilterChange, onCapabilityFilterChange]
  );

  // Handler for filter changes
  const handleFilterChange = useCallback(
    (filterId: string, values: string[]) => {
      if (filterId === 'model') {
        onModelFilterChange(values);
      } else if (filterId === 'capability') {
        onCapabilityFilterChange(values);
      }
    },
    [onModelFilterChange, onCapabilityFilterChange]
  );

  return (
    <Accordion>
      {filterConfigs.map(filter => (
        <AccordionItem
          key={filter.id}
          open={filter.isOpen}
          title={
            <Stack orientation="horizontal" gap="small">
              {filter.title}
              {filter.selectedOptions.length > 0 && (
                <DismissibleTag
                  size="sm"
                  text={`${filter.selectedOptions.length}`}
                  onClose={() => handleClearFilter(filter.id)}
                />
              )}
            </Stack>
          }
          onHeadingClick={() => handleAccordionHeadingClick(filter.id)}
        >
          <FilterCheckboxList
            selectedValues={filter.selectedOptions}
            options={filter.options}
            onChange={values => handleFilterChange(filter.id, values)}
            groupId={`${filter.id}-filter`}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
