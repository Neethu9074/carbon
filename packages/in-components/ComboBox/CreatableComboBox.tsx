/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import CreatableSelect, { Props as CreatableSelectProps } from 'react-select/creatable';
import { GroupTypeBase, OptionTypeBase } from 'react-select';
import React from 'react';

import './ComboBox.less';

export type CreatableComboBoxProps<
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
> = Omit<CreatableSelectProps<OptionType, IsMulti, GroupType>, 'classNamePrefix'>;

export default function CreatableComboBox<
  OptionType extends OptionTypeBase,
  IsMulti extends boolean,
  GroupType extends GroupTypeBase<OptionType> = GroupTypeBase<OptionType>
>({ isClearable = true, className, ...props }: CreatableComboBoxProps<OptionType, IsMulti, GroupType>) {
  return (
    <CreatableSelect {...props} isClearable={isClearable} classNamePrefix="Select" className={`${className} Select`} />
  );
}
