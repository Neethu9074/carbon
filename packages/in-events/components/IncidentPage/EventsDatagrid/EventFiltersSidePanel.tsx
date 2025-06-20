/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { Accordion, AccordionItem, Checkbox, DismissibleTag, Toggle } from '@carbon/react';
// eslint-disable-next-line no-restricted-imports
import { SidePanel } from '@carbon/ibm-products';
import { isEqual } from 'lodash';
import React from 'react';

import EventFilterSections, {
  FilterSection
} from 'in-events/components/IncidentPage/EventsDatagrid/EventFilterSections';
import { parseQueryToFilters, filtersToQuery } from 'in-events/components/IncidentPage/EventsDatagrid/parseQuery';
import { t } from 'in-i18n';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid.mless';

interface EventFiltersSidePanelProps {
  filterPanelOpen: boolean;
  setIsFilterPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentFilters: string;
  onFilterChange?: (newFilters: string) => void;
}

const EventFiltersSidePanel: React.FC<EventFiltersSidePanelProps> = ({
  filterPanelOpen,
  setIsFilterPanelOpen,
  currentFilters,
  onFilterChange
}) => {
  // Convert the currentFilters string to filter objects with checked status
  const [filters, setFilters] = React.useState<FilterSection[]>(() =>
    parseQueryToFilters(currentFilters, EventFilterSections)
  );

  // Update filters when currentFilters prop changes
  React.useEffect(() => {
    setFilters(parseQueryToFilters(currentFilters, EventFilterSections));
  }, [currentFilters]);

  // Apply filters when the user clicks the apply button
  const handleApplyFilters = () => {
    const newFilterQuery = filtersToQuery(filters);
    if (onFilterChange) {
      onFilterChange(newFilterQuery);
    }
    setIsFilterPanelOpen(false);
  };

  // Handle checkbox changes
  const handleFilterChange = (sectionIndex: number, filterIndex: number, checked: boolean) => {
    const newFilters = [...filters];
    newFilters[sectionIndex].filters[filterIndex].checked = checked;
    setFilters(newFilters);
  };

  // Handle toggle changes
  const handleToggleChange = (sectionIndex: number, filterIndex: number, checked: boolean): void => {
    const newFilters = [...filters];

    // Update the toggle state
    newFilters[sectionIndex].filters[filterIndex].checked = checked;

    // Special handling for the transient events toggle
    if (newFilters[sectionIndex].filters[filterIndex].id === 'show-transient') {
      // Find the transient checkbox in the same section
      const transientCheckboxIndex = newFilters[sectionIndex].filters.findIndex(f => f.id === 'transient');

      if (transientCheckboxIndex !== -1) {
        // If toggle is off (hide transient events), disable the transient checkbox and uncheck it
        if (!checked) {
          newFilters[sectionIndex].filters[transientCheckboxIndex].disabled = true;
          newFilters[sectionIndex].filters[transientCheckboxIndex].checked = false;
        } else {
          // If toggle is on (show transient events), enable the transient checkbox
          newFilters[sectionIndex].filters[transientCheckboxIndex].disabled = false;
        }
      }
    }

    setFilters(newFilters);
  };

  const handleSectionChange = (sectionIndex: number) => {
    const newFilters = [...filters];
    newFilters[sectionIndex].filters.forEach((filter, i) => {
      // Don't reset toggles when clearing section filters
      if (filter.type !== 'toggle') {
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
        // {
        //   label: 'Cancel',
        //   kind: 'secondary',
        //   onClick: handlePanelClose,
        //   size: 'sm'
        // },
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
          {filters.map((section, sectionIndex) => {
            // Count only checkbox filters for the badge, not toggles
            const numChecked = filters[sectionIndex].filters.filter(f => f.checked && f.type === 'checkbox').length;
            return (
              <AccordionItem
                open
                key={sectionIndex}
                title={
                  <div className={locals.sidePanelAccordionTitle}>
                    {section.label}
                    {numChecked > 0 && (
                      <DismissibleTag onClose={() => handleSectionChange(sectionIndex)} text={numChecked.toString()} />
                    )}
                  </div>
                }
              >
                {section.filters.map((filter, filterIndex) => {
                  if (filter.type === 'checkbox') {
                    return (
                      <Checkbox
                        key={filter.id}
                        id={`filter-${sectionIndex}-${filterIndex}`}
                        labelText={filter.label}
                        checked={filter.checked}
                        disabled={filter.disabled}
                        onChange={(_, { checked }) => handleFilterChange(sectionIndex, filterIndex, checked)}
                      />
                    );
                  } else if (filter.type === 'toggle') {
                    return (
                      <div key={filter.id}>
                        <Toggle
                          id={`filter-${sectionIndex}-${filterIndex}`}
                          labelA={filter.label}
                          labelB={filter.label}
                          toggled={filter.checked}
                          onToggle={toggled => handleToggleChange(sectionIndex, filterIndex, toggled)}
                          size="sm"
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </SidePanel>
  );
};

export default EventFiltersSidePanel;
