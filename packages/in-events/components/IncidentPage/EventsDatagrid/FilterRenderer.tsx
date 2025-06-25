/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { AccordionItem, Checkbox, DismissibleTag, Toggle, RadioButtonGroup, RadioButton } from '@carbon/react';
import React, { useMemo } from 'react';

import { FilterSection } from 'in-events/components/IncidentPage/EventsDatagrid/EventFilterSections';

import locals from 'in-events/components/IncidentPage/EventsDatagrid/EventsDatagrid.mless';

// Add local styles for radio groups if not already defined in the mless file
const localStyles = {
  radioGroup: {
    marginBottom: '1rem'
  }
};

interface FilterRendererProps {
  section: FilterSection;
  sectionIndex: number;
  setFilters: React.Dispatch<React.SetStateAction<FilterSection[]>>;
  onSectionChange: (sectionIndex: number) => void;
}

const FilterRenderer: React.FC<FilterRendererProps> = ({ section, sectionIndex, setFilters, onSectionChange }) => {
  // Count only checkbox filters for the badge, not toggles or radio buttons
  const numChecked = useMemo(
    () => section.filters.filter(f => f.checked && f.type === 'checkbox').length,
    [section.filters]
  );

  // For radio buttons, count if any non-default option is selected
  const radioSelections = useMemo(() => {
    const radioGroups = new Set<string>();
    section.filters.forEach(filter => {
      if (filter.type === 'radio' && filter.radioGroup) {
        radioGroups.add(filter.radioGroup);
      }
    });

    let selections = 0;
    radioGroups.forEach(groupName => {
      // For transient radio group, check if anything other than "Show all" is selected
      if (groupName === 'transient') {
        const nonDefaultSelected = section.filters.some(
          f => f.radioGroup === 'transient' && f.id !== 'transient-all' && f.checked
        );
        if (nonDefaultSelected) {
          selections++;
        }
      }
    });

    return selections;
  }, [section.filters]);

  const totalChecked = numChecked + radioSelections;

  // Handle checkbox changes
  const handleFilterChange = (filterIndex: number, checked: boolean) => {
    setFilters(prevFilters => {
      const newFilters = [...prevFilters];
      newFilters[sectionIndex].filters[filterIndex].checked = checked;
      return newFilters;
    });
  };

  // Handle toggle changes
  const handleToggleChange = (filterIndex: number, checked: boolean): void => {
    setFilters(prevFilters => {
      const newFilters = [...prevFilters];
      newFilters[sectionIndex].filters[filterIndex].checked = checked;
      return newFilters;
    });
  };

  // Handle radio button changes
  const handleRadioChange = (selectedId: string | number | undefined): void => {
    if (selectedId === undefined) return;

    const selectedIdStr = String(selectedId);

    setFilters(prevFilters => {
      const newFilters = [...prevFilters];

      // Find all radio buttons in the same group and update their checked status
      const radioGroup = newFilters[sectionIndex].filters.find(f => f.id === selectedIdStr)?.radioGroup;

      if (radioGroup) {
        // Uncheck all radio buttons in the same group
        newFilters[sectionIndex].filters.forEach((filter, index) => {
          if (filter.radioGroup === radioGroup) {
            newFilters[sectionIndex].filters[index].checked = filter.id === selectedIdStr;
          }
        });
      }

      return newFilters;
    });
  };

  // Render the filter content
  const renderFilterContent = () => {
    // Find all radio groups in this section
    const radioGroups = new Set<string>();
    section.filters.forEach(filter => {
      if (filter.type === 'radio' && filter.radioGroup) {
        radioGroups.add(filter.radioGroup);
      }
    });

    // Render each radio group
    const radioGroupElements = Array.from(radioGroups).map(groupName => {
      const radioFilters = section.filters.filter(filter => filter.type === 'radio' && filter.radioGroup === groupName);

      // Find the selected radio button in this group
      const selectedRadio = radioFilters.find(filter => filter.checked)?.id || '';

      return (
        <div key={`radio-group-${groupName}`} style={localStyles.radioGroup}>
          <RadioButtonGroup
            name={`radio-group-${sectionIndex}-${groupName}`}
            onChange={selectedId => handleRadioChange(selectedId)}
            valueSelected={selectedRadio}
            orientation="vertical"
          >
            {radioFilters.map(filter => (
              <RadioButton
                key={filter.id}
                id={filter.id}
                labelText={filter.label}
                value={filter.id}
                disabled={filter.disabled}
              />
            ))}
          </RadioButtonGroup>
        </div>
      );
    });

    // Render non-radio filters
    const otherFilters = section.filters
      .filter(filter => filter.type !== 'radio')
      .map(filter => {
        if (filter.type === 'checkbox') {
          return (
            <Checkbox
              key={filter.id}
              id={`filter-${sectionIndex}-${filter.id}`}
              labelText={filter.label}
              checked={filter.checked}
              disabled={filter.disabled}
              onChange={(_, { checked }) => {
                const idx = section.filters.findIndex(f => f.id === filter.id);
                handleFilterChange(idx, checked);
              }}
            />
          );
        } else if (filter.type === 'toggle') {
          return (
            <div key={filter.id}>
              <Toggle
                id={`filter-${sectionIndex}-${filter.id}`}
                labelA={filter.label}
                labelB={filter.label}
                toggled={filter.checked}
                onToggle={toggled => {
                  const idx = section.filters.findIndex(f => f.id === filter.id);
                  handleToggleChange(idx, toggled);
                }}
                size="sm"
              />
            </div>
          );
        }
        return null;
      });

    return (
      <>
        {radioGroupElements}
        {otherFilters}
      </>
    );
  };

  return (
    <AccordionItem
      open
      title={
        <div className={locals.sidePanelAccordionTitle}>
          {section.label}
          {totalChecked > 0 && (
            <DismissibleTag onClose={() => onSectionChange(sectionIndex)} text={totalChecked.toString()} />
          )}
        </div>
      }
    >
      {renderFilterContent()}
    </AccordionItem>
  );
};

export default FilterRenderer;
