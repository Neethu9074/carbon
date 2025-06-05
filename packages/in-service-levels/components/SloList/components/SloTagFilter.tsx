/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect } from 'react';

import { FilterableMultiSelect } from '@instana/carbon';

import { t } from 'in-i18n';

export interface SloTagFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  tags?: string[];
}

function mapTags(tags?: string[]) {
  // TODO: Check this
  if (!tags || !tags.length) {
    return [
      {
        value: '',
        label: t('in-service-levels:sloList.components.sloTagFilter.noTagsInfo')
      }
    ];
  }

  return tags.map(t => ({ label: t, value: t }));
}

export default function SloTagFilter({ tags, value, onChange }: SloTagFilterProps) {
  const selectedItems = value?.length > 0 ? mapTags(value) : [];

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
    <FilterableMultiSelect<{ label: string; value: string }>
      id="slo-tag-filter"
      placeholder={t('in-service-levels:sloList.components.sloTagFilter.placeholder')}
      selectedItems={selectedItems}
      items={mapTags(tags)}
      onChange={({ selectedItems }) => {
        const newValue = selectedItems || [];
        onChange(newValue.map(option => option.value));
      }}
      filterItems={(items, { itemToString, inputValue }) =>
        items.filter(item => {
          if (!inputValue) return true;
          return itemToString(item).toLowerCase().includes(inputValue.toLowerCase());
        })
      }
    />
  );
}
