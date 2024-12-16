/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';
import { compareIgnoreCase } from 'in-services/util/string';
import { t } from 'in-i18n';

function mapTags(tags: string[]) {
  if (!tags.length) {
    return [
      {
        value: '',
        label: t('in-automation:noTagsAvailable'),
        isDisabled: true
      }
    ];
  }

  return tags.map(t => ({ label: t, value: t })).sort((a, b) => compareIgnoreCase(a.label, b.label));
}

interface TagsFilterProps {
  tags: string[];
  setTags: (type: string[]) => void;
  availableTags: string[];
}

export function TagsFilter({ tags, setTags, availableTags }: TagsFilterProps) {
  syncTags({ tags, setTags, availableTags });
  return (
    <ComboBox
      options={mapTags(availableTags)}
      placeholder={t('in-automation:tag')}
      value={tags}
      isMulti
      onChange={newValue => {
        if (!newValue) {
          setTags([]);
        } else if (hasMultipleValuesSelected(newValue)) {
          setTags(newValue.map(option => option.value));
        } else {
          setTags([newValue.value]);
        }
      }}
    />
  );
}

function syncTags({ tags, setTags, availableTags }: TagsFilterProps) {
  // urlTags value - If tags aren't found in availableTags, we will filter those to update tags value in url.
  const urlTags = availableTags.length > 0 ? tags.filter(tag => availableTags.includes(tag)) : tags;
  // This handles the case when available tags doesn't have tag (action with tag deleted), we will update tags with urlTags.
  let isValid =
    tags.length > 0 &&
    (urlTags.length === 0 || (urlTags.every(tag => tags.includes(tag)) && urlTags.length < tags.length));
  if (isValid) {
    setTags(tags.filter(tag => availableTags.includes(tag)));
  }
}
