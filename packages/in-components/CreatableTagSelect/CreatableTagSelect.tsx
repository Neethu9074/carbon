/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GroupTypeBase, OptionTypeBase } from 'react-select';
import { CreatableProps } from 'react-select/creatable';
import React from 'react';

import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import { t } from 'in-i18n';

interface OptionType extends OptionTypeBase {
  value: string;
}

const mapTagToSelectOption = (tag: string): OptionType => ({ value: tag, label: tag });

interface CreatableTagSelectProps<
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
> {
  value: string[];
  onChange: (value: string[]) => void;
  tags?: string[];
  disabled?: boolean;
  id?: string;
  isLoading?: boolean;
  isValidNewOption?: CreatableProps<OptionType, IsMulti, GroupType>['isValidNewOption'];
}

export default function CreatableTagSelect<
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>({
  id,
  tags,
  value,
  onChange,
  isLoading,
  disabled,
  isValidNewOption
}: CreatableTagSelectProps<OptionType, IsMulti, GroupType>) {
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
      formatCreateLabel={(tag: string) => t('in-components:creatableTagSelect.createLabel', { tag })}
      placeholder={t('in-components:creatableTagSelect.placeholder')}
      aria-label={t('in-components:creatableTagSelect.placeholder')}
      isMulti
      isValidNewOption={isValidNewOption}
    />
  );
}
