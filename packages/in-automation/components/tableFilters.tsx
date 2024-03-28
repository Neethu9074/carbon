/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';

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

  return tags.map(t => ({ label: t, value: t }));
}

interface TagsFilterProps {
  tags: string[];
  setTags: (type: string[]) => void;
  availableTags: string[];
}

export function TagsFilter({ tags, setTags, availableTags }: TagsFilterProps) {
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
