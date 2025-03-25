/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ComponentProps, useEffect } from 'react';

import { CarbonFilterableMultiSelect } from '@instana/components';

import { t } from 'in-i18n';

export interface SloTagFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  tags?: string[];
}

interface Option {
  label: string;
  value: string;
}

type CarbonFilterableMultiSelectProps = ComponentProps<typeof CarbonFilterableMultiSelect<Option>>;
const sloTagFilterItems: CarbonFilterableMultiSelectProps['filterItems'] = (items, { itemToString, inputValue }) => {
  return items.filter(item => {
    if (!inputValue) {
      return true;
    }
    return itemToString(item).toLowerCase().includes(inputValue.toLowerCase());
  });
};

export default function SloTagFilter({ tags, value, onChange }: SloTagFilterProps) {
  const selectedFilters = value?.length > 0 ? mapTags(value) : [];

  useEffect(() => {
    const validTags = tags || [];
    // Filter out tags that aren't in the available tags list
    const filteredTags = validTags.length > 0 ? value.filter(tag => validTags.includes(tag)) : value;
    // Check if the value list contains any tags that are no longer valid
    const isValid = value.length > 0 && (filteredTags.length === 0 || filteredTags.length < value.length);

    if (isValid) {
      // Update the value with only valid tags
      onChange(filteredTags);
    }
  }, [value, tags, onChange]);

  return (
    <CarbonFilterableMultiSelect
      id="sloTagFilter"
      placeholder={t('in-service-levels:sloList.components.sloTagFilter.placeholder')}
      size="sm"
      initialSelectedItems={selectedFilters}
      items={mapTags(tags)}
      onChange={selected => {
        const newValue = selected.selectedItems || [];
        onChange(newValue.map(option => option.value));
      }}
      filterItems={sloTagFilterItems}
    />
  );
}

function mapTags(tags?: string[]) {
  if (!tags || !tags.length) {
    return [
      {
        value: '',
        label: t('in-service-levels:sloList.components.sloTagFilter.noTagsInfo'),
        isDisabled: true
      }
    ];
  }

  return tags.map(t => ({ label: t, value: t }));
}
