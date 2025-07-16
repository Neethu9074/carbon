/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { TagSet } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { Button } from '@carbon/react';
import React, { useMemo } from 'react';

import { parseQueryToFilters, filtersToQuery } from 'in-events/components/IncidentPage/EventsDatagrid/parseQuery';
import getEventFilterSections from 'in-events/components/IncidentPage/EventsDatagrid/EventFilterSections';
import { EVENT_KINDS } from 'in-events/components/EventsPage/EventsTable/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid.mless';

interface EventsAppliedFiltersProps {
  currentFilters: string;
  onFilterChange?: (newFilters: string) => void;
  eventType: EVENT_KINDS;
}

/**
 * Component that displays the currently applied filters as dismissible tags
 */
const EventsAppliedFilters: React.FC<EventsAppliedFiltersProps> = ({ currentFilters, onFilterChange, eventType }) => {
  // Parse the current filters to get the filter objects
  const parsedFilters = useMemo(() => {
    return parseQueryToFilters(currentFilters, getEventFilterSections(eventType));
  }, [currentFilters, eventType]);

  // Extract the applied filters (those that are checked)
  const appliedFilters = useMemo(() => {
    const result: { id: string; label: string; groupId: number }[] = [];

    parsedFilters.forEach((filterGroup, groupIndex) => {
      filterGroup.filters.forEach(value => {
        // Skip the "Show all" option (transient-all) even if it's checked
        if (value.checked && value.id !== 'transient-all') {
          result.push({
            id: value.id,
            label: value.label,
            groupId: groupIndex
          });
        }
      });
    });

    return result;
  }, [parsedFilters]);

  // If there are no applied filters, don't render anything
  if (appliedFilters.length === 0) {
    return null;
  }

  // Handle removing a filter
  const handleRemoveFilter = (filterId: string) => {
    if (!onFilterChange) return;

    // Create a deep copy of the filters
    const updatedFilters = [...parsedFilters];

    // Find the filter to remove
    let filterToRemove: { id: string; checked: boolean; radioGroup?: string } | undefined;
    updatedFilters.forEach(filterGroup => {
      filterGroup.filters.forEach(value => {
        if (value.id === filterId) {
          filterToRemove = value;
          value.checked = false;
        }
      });
    });

    // If removing a transient filter, set "Show all" to checked
    if (filterToRemove?.radioGroup === 'transient') {
      updatedFilters.forEach(filterGroup => {
        filterGroup.filters.forEach(value => {
          if (value.id === 'transient-all') {
            value.checked = true;
          }
        });
      });
    }

    // Convert the updated filters back to a query string
    const newFilterQuery = filtersToQuery(updatedFilters);
    onFilterChange(newFilterQuery);
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    if (!onFilterChange) return;

    // Create a deep copy of the filters
    const updatedFilters = [...parsedFilters];

    // Uncheck all filters, but set "Show all" to checked
    updatedFilters.forEach(filterGroup => {
      filterGroup.filters.forEach((value: { id: string; checked: boolean; radioGroup?: string }) => {
        // Set "Show all" option to checked, uncheck everything else
        if (value.id === 'transient-all') {
          value.checked = true;
        } else if (value.radioGroup === 'transient') {
          // Uncheck other radio buttons in the transient group
          value.checked = false;
        } else {
          // Uncheck all other filters
          value.checked = false;
        }
      });
    });

    // Convert the updated filters back to a query string (empty)
    const newFilterQuery = filtersToQuery(updatedFilters);
    onFilterChange(newFilterQuery);
  };

  return (
    <div className={locals.appliedFilters}>
      <TagSet
        tags={appliedFilters.map(filter => ({
          id: filter.id,
          label: filter.label,
          onClose: () => handleRemoveFilter(filter.id)
        }))}
        align="start"
      />
      <Button kind="ghost" size="lg" onClick={handleClearAllFilters}>
        {t('in-events:dataGridEventTable.clearAll')}
      </Button>
    </div>
  );
};

export default EventsAppliedFilters;
