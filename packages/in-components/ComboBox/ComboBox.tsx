/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Select from 'react-select';
import { isEqual } from 'lodash';
import React from 'react';

// Carbon version of ComboBox for single select
import { ComboBox as CarbonComboBox, ComboBoxProps as CarbonComboBoxProps } from '@instana/components';

import { carbonComboBoxEnabled } from 'in-services/featureFlags';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import './DropDownDirection.less';
import './ComboBox.less';

export interface Option {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export type Options = ReadonlyArray<Option>;

export function hasMultipleValuesSelected(value: Option | Options | null): value is Options {
  return Array.isArray(value);
}

interface ComboBoxProps {
  id?: string;
  name?: string;
  isClearable?: boolean;
  options: Options;
  value: string | ReadonlyArray<string> | Nullish;
  defaultValue?: any;
  className?: string;
  placeholder?: React.ReactNode;
  onChange: (option: Option | Options | null) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  openMenuOnFocus?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  isOptionDisabled?: (option: Option) => boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  components?: any;
  carbonVariant?: boolean;
}

export default function ComboBox({ isClearable = true, ...props }: ComboBoxProps): JSX.Element {
  const value =
    props.options?.filter((option: Option) =>
      Array.isArray(props.value) ? props.value.includes(option.value) : option.value === props.value
    ) ?? null;

  if (!props?.isMulti && (carbonComboBoxEnabled || props.carbonVariant)) {
    const cprops: CarbonComboBoxProps = { ...props, value: props.value as Option | null | undefined };
    return <CarbonComboBox {...cprops} />;
  }

  return (
    <Select
      {...props}
      isClearable={isClearable}
      classNamePrefix="Select"
      aria-label={props.name ?? 'label'}
      className={`${props.className} Select`}
      placeholder={props.placeholder ? props.placeholder : t('in-components:comboBox.placeholderSelect')}
      onChange={(option: Option | Options | null) => {
        // Do not propagate the event, unless the value really changed. This will prevent unnecessary reloads.
        if (Array.isArray(option)) {
          if (
            !isEqual(
              option.map(o => o?.value),
              props.value
            )
          ) {
            props.onChange(option);
          }
        } else {
          if (!(option instanceof Array) && !isEqual(option?.value, props.value)) {
            props.onChange(option);
          }
        }
      }}
      value={value}
    />
  );
}
