/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AsyncPaginate, LoadOptions, UseAsyncPaginateParams, ComponentProps } from 'react-select-async-paginate';
import { OptionTypeBase, NamedProps, OptionsType } from 'react-select';
import React, { useState, FC } from 'react';
import { isEqual } from 'lodash';

import { PaginatedResult, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import { isLoading } from 'in-services/util/result';
import { Option } from 'in-components/ComboBox';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import './DropDownDirection.less';
import './ComboBox.less';

type Loader<Resource> = (query: string, page: number) => Observable<Result<PaginatedResult<Resource>>>;

type Mapper<Resource, OptionType extends OptionTypeBase = Option> = (item: Resource) => OptionType;

type Additional = { page: number };

const useLoadOptions = <Resource, OptionType extends OptionTypeBase = Option>(
  loader: Loader<Resource>,
  mapper: Mapper<Resource, OptionType>,
  options?: ReadonlyArray<OptionType>
) => {
  const [loadedOptions, setLoadedOptions] = useState<OptionsType<OptionType>>(options ?? []);
  const loadOptions: LoadOptions<OptionType, Additional> = function (query, loadedOptions, { page } = { page: 1 }) {
    return new Promise(function (resolve) {
      loader(query, page)
        .filter(response => !isLoading(response))
        .once(res => {
          const { data } = res;
          const { items = [], totalHits = 0 } = data ?? {};
          const totalLoaded = loadedOptions.length + items.length;
          const options = items.map(mapper);
          setLoadedOptions(prevOptions => [...prevOptions, ...options]);
          resolve({
            hasMore: totalLoaded < totalHits,
            options,
            additional: {
              page: page + 1
            }
          });
        });
    });
  };
  return [loadOptions, loadedOptions] as const;
};

type AsyncPaginateProps<OptionType extends OptionTypeBase = Option, IsMulti extends boolean = false> = NamedProps<
  OptionType,
  IsMulti
> &
  UseAsyncPaginateParams<
    OptionType,
    {
      page: number;
    }
  > &
  ComponentProps;

export type LazyComboBoxProps<
  Resource,
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false
> = Omit<AsyncPaginateProps<OptionType, IsMulti>, 'loadOptions' | 'value'> & {
  loader: Loader<Resource>;
  mapper: Mapper<Resource, OptionType>;
  value: string | ReadonlyArray<string> | Nullish;
  options?: OptionsType<OptionType>;
};

export default function LazyComboBox<
  Resource,
  OptionType extends OptionTypeBase = Option,
  IsMulti extends boolean = false
>(props: LazyComboBoxProps<Resource, OptionType, IsMulti>) {
  const { value, loader, mapper, options, className, name, placeholder, onChange } = props;
  const [loadOptions, loadedOptions] = useLoadOptions(loader, mapper, options);

  const valueAsOption =
    loadedOptions.filter(option => (Array.isArray(value) ? value.includes(option.value) : option?.value === value)) ??
    null;
  const CastedAsyncPaginate = AsyncPaginate as FC<AsyncPaginateProps<OptionType, IsMulti>>;

  return (
    <CastedAsyncPaginate
      {...props}
      loadOptions={loadOptions}
      additional={{
        page: 1
      }}
      classNamePrefix="Select"
      aria-label={name ?? 'label'}
      className={`${className} Select`}
      placeholder={placeholder ? placeholder : t('in-components:comboBox.placeholderSelect')}
      onChange={(option, action) => {
        // Do not propagate the event, unless the value really changed. This will prevent unnecessary reloads.
        const isArray = option instanceof Array;

        if (
          isArray &&
          !isEqual(
            option.map(o => o?.value),
            value
          )
        )
          return onChange?.(option, action);

        if (!isArray && !isEqual(option?.value, value)) {
          onChange?.(option, action);
        }
      }}
      value={valueAsOption}
    />
  );
}
