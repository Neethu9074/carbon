/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { SidePanel } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { Accordion } from '@carbon/react';
import React, { useMemo } from 'react';
import { isEqual } from 'lodash';

import getEventFilterSections, {
  FilterSection
} from 'in-events/components/IncidentPage/EventsDatagrid/EventFilterSections';
import { parseQueryToFilters, filtersToQuery } from 'in-events/components/IncidentPage/EventsDatagrid/parseQuery';
import FilterRenderer from 'in-events/components/IncidentPage/EventsDatagrid/FilterRenderer';
import { EVENT_KINDS } from 'in-events/components/EventsPage/EventsTable/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid.mless';

interface EventFiltersSidePanelProps {
  filterPanelOpen: boolean;
  setIsFilterPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentFilters: string;
  onFilterChange?: (newFilters: string) => void;
  eventType: EVENT_KINDS;
}

const EventFiltersSidePanel: React.FC<EventFiltersSidePanelProps> = ({
  filterPanelOpen,
  setIsFilterPanelOpen,
  currentFilters,
  onFilterChange,
  eventType
}) => {
  const EventFilterSections = useMemo(() => getEventFilterSections(eventType), [eventType]);
  // Convert the currentFilters string to filter objects with checked status
  const [filters, setFilters] = React.useState<FilterSection[]>(() =>
    parseQueryToFilters(currentFilters, EventFilterSections)
  );

  // Update filters when currentFilters prop changes
  React.useEffect(() => {
    setFilters(parseQueryToFilters(currentFilters, EventFilterSections));
  }, [currentFilters, EventFilterSections]);

  // Apply filters when the user clicks the apply button
  const handleApplyFilters = () => {
    const newFilterQuery = filtersToQuery(filters);
    if (onFilterChange) {
      onFilterChange(newFilterQuery);
    }
    setIsFilterPanelOpen(false);
  };

  const handleSectionChange = (sectionIndex: number) => {
    const newFilters = [...filters];

    // Group filters by type
    const radioGroups = new Set<string>();

    // Find all radio groups in this section
    newFilters[sectionIndex].filters.forEach(filter => {
      if (filter.type === 'radio' && filter.radioGroup) {
        radioGroups.add(filter.radioGroup);
      }
    });

    // For each radio group, set the default option to checked
    radioGroups.forEach(groupName => {
      // For transient radio group, set "Show all" as default
      if (groupName === 'transient') {
        const allRadioIndex = newFilters[sectionIndex].filters.findIndex(
          f => f.radioGroup === 'transient' && f.id === 'transient-all'
        );

        if (allRadioIndex !== -1) {
          // Set all radio buttons in this group to unchecked
          newFilters[sectionIndex].filters.forEach((filter, i) => {
            if (filter.radioGroup === 'transient') {
              newFilters[sectionIndex].filters[i].checked = filter.id === 'transient-all';
            }
          });
        }
      }
    });

    // Reset all checkboxes
    newFilters[sectionIndex].filters.forEach((filter, i) => {
      // Don't reset toggles or radio buttons when clearing section filters
      if (filter.type === 'checkbox') {
        newFilters[sectionIndex].filters[i].checked = false;
      }
    });

    setFilters(newFilters);
  };

  // Reset filters to original state when panel is closed
  const handlePanelClose = () => {
    setFilters(parseQueryToFilters(currentFilters, EventFilterSections));
    setIsFilterPanelOpen(false);
  };

  // Compare current filters with original filters parsed from the same query string
  const originalFilters = parseQueryToFilters(currentFilters, EventFilterSections);
  const isFilterChanged = !isEqual(filters, originalFilters);

  return (
    <SidePanel
      title={t('in-events:dataGridEventTable.filterTitle')}
      open={filterPanelOpen}
      onRequestClose={handlePanelClose}
      slideIn
      selectorPageContent="#eventsTableContainer"
      size="sm"
      placement="left"
      className={locals.sidePanel}
      actions={[
        {
          label: t('in-events:dataGridEventTable.apply'),
          kind: 'primary',
          onClick: handleApplyFilters,
          disabled: !isFilterChanged,
          size: 'sm'
        }
      ]}
    >
      <div className={locals.filterContent}>
        <Accordion>
          {filters.map((section, sectionIndex) => (
            <FilterRenderer
              key={sectionIndex}
              section={section}
              sectionIndex={sectionIndex}
              setFilters={setFilters}
              onSectionChange={handleSectionChange}
            />
          ))}
        </Accordion>
      </div>
    </SidePanel>
  );
};

export default EventFiltersSidePanel;
