/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';
import { OptionTypeBase } from 'react-select';

import { t } from 'in-i18n';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { SloTagFilterProps } from 'in-service-levels/components/SloList/components/SloTagFilter';

interface OptionType extends OptionTypeBase {
  value: string;
}

const mapTagToSelectOption = (tag: string): OptionType => ({ value: tag, label: tag });

interface CreatableTagSelectProps extends SloTagFilterProps {
  id?: string;
  isLoading?: boolean;
}

export default function CreatableTagSelect({
  id,
  tags,
  value,
  onChange,
  isLoading,
  disabled
}: CreatableTagSelectProps) {
  const options = tags?.map(mapTagToSelectOption);
  const selectValue = value.map(mapTagToSelectOption);

  return (
    <CreatableComboBox
      id={id}
      value={selectValue}
      options={options}
      isLoading={isLoading}
      isDisabled={disabled}
      onChange={(tagOptions: OptionType[]) => onChange(tagOptions.map(({ value }) => value) ?? [])}
      formatCreateLabel={(tag: string) => t('in-service-levels:createSloDialog.tagsCreateLabel', { tag })}
      placeholder={t('in-service-levels:createSloDialog.tagsPlaceholder')}
      aria-label={t('in-service-levels:createSloDialog.tagsPlaceholder')}
      isMulti
    />
  );
}
