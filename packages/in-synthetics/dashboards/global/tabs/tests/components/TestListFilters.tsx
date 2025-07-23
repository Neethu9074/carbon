/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useCallback, useMemo } from 'react';

import { Accordion, AccordionItem, DismissibleTag, Stack } from '@instana/carbon';

import {
  getApplicationLabels,
  getAssociationLabels,
  getLocationLabels,
  getSyntheticTypes
} from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import { FilterCheckboxList } from 'in-synthetics/dashboards/global/tabs/tests/components/FilterCheckboxList';
import { FilterConfig, FilterState, TestListFiltersProps } from 'in-synthetics/utils/constants';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { FilterId } from 'in-synthetics/components/constants';
import { t } from 'in-i18n';

import locals from './TestListFilters.mless';

/**
 * TestListFilters component renders filter accordions for test list
 */
export default function TestListFilters({
  filters,
  setFilters,
  result,
  isAssociationsContext = false
}: TestListFiltersProps) {
  // Extract filter values from props
  const { syntheticTypes, locationIds, entityIds = [], applicationIds = [] } = filters;

  // Track open/closed state of filter accordions
  const [isFilterOpen, setIsFilterOpen] = useState<Record<FilterId, boolean>>({
    type: syntheticTypes.length > 0,
    location: locationIds.length > 0,
    association: entityIds.length > 0,
    application: applicationIds.length > 0
  });

  // Map filter IDs to their corresponding property names in FilterState
  const filterKeyMap = useMemo(() => {
    return new Map<FilterId, keyof FilterState>([
      ['type', 'syntheticTypes'],
      ['location', 'locationIds'],
      ['association', 'entityIds'],
      ['application', 'applicationIds']
    ]);
  }, []);

  // Handler for clearing filter values
  const handleClearFilter = useCallback(
    (filterId: FilterId) => {
      const key = filterKeyMap.get(filterId);
      if (key) {
        setFilters(prev => ({
          ...prev,
          [key]: []
        }));
      }
    },
    [filterKeyMap, setFilters]
  );

  // Handler for updating filter values
  const handleFilterChange = useCallback(
    (filterId: FilterId, newValues: string[]) => {
      const key = filterKeyMap.get(filterId);
      if (key) {
        setFilters(prev => ({
          ...prev,
          [key]: newValues
        }));
      }
    },
    [filterKeyMap, setFilters]
  );

  // Handler for accordion heading click
  const handleAccordionHeadingClick = useCallback((filterId: FilterId) => {
    setIsFilterOpen(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  }, []);

  // Generate filter configurations
  const generateFilterConfigs = useCallback((): FilterConfig[] => {
    const configs: FilterConfig[] = [
      {
        id: 'type',
        title: t('in-synthetics:dashboard.testList.filterPanel.typeLabel'),
        isOpen: isFilterOpen.type || true,
        selectedOptions: syntheticTypes,
        options: getSyntheticTypes(result)
      },
      {
        id: 'location',
        title: t('in-synthetics:dashboard.testList.filterPanel.locationLabel'),
        isOpen: isFilterOpen.location,
        selectedOptions: locationIds,
        options: getLocationLabels(result)
      }
    ];

    // Add association or application filter based on context and feature flag
    if (!isAssociationsContext) {
      if (syntheticRbacLimitedEnabled) {
        configs.push({
          id: 'association',
          title: t('in-synthetics:dashboard.testList.filterPanel.associationLabel'),
          isOpen: isFilterOpen.association,
          selectedOptions: entityIds,
          options: getAssociationLabels(result) ?? []
        });
      } else {
        configs.push({
          id: 'application',
          title: t('in-synthetics:dashboard.testList.filterPanel.applicationLabel'),
          isOpen: isFilterOpen.application,
          selectedOptions: applicationIds,
          options: getApplicationLabels(result) ?? []
        });
      }
    }

    return configs;
  }, [isFilterOpen, syntheticTypes, locationIds, entityIds, applicationIds, result, isAssociationsContext]);

  // Get filter configurations
  const filterConfigs = generateFilterConfigs();

  return (
    <Accordion className={locals.filterAccordion}>
      {filterConfigs.map(filter => (
        <AccordionItem
          key={filter.id}
          open={filter.isOpen}
          className={locals.filterAccordionItem}
          title={
            <Stack orientation="horizontal" className={locals.filterAccordionItemHeader}>
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
            onChange={newValues => handleFilterChange(filter.id, newValues)}
            groupId={`${filter.id}-filter`}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
