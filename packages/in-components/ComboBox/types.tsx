/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Nullish } from 'in-types';

export interface Option {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export type Options = ReadonlyArray<Option>;

export interface ComboBoxProps {
  id?: string;
  name?: string;
  isClearable?: boolean;
  options: Options;
  value: string | ReadonlyArray<string> | Nullish;
  defaultValue?: any;
  className?: string;
  placeholder?: string;
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
  highlightFilter?: boolean;
  resultsToShow?: number;
}
