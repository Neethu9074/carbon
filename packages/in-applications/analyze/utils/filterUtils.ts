/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create } from '@instana/observables';
import { SavedFilter } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';

export const clickedFilter$ = create<Partial<SavedFilter> | null>();
clickedFilter$.emit(null);

export const setClickedFilter = (filter: Partial<SavedFilter> | null) => {
  clickedFilter$.emit(filter);
};

export const cleanTagFilterExpression = (data: FormModelElement[]) => {
  return data.map((item: FormModelElement) => {
    return item.type === 'TAG_FILTER'
      ? {
          name: item.name,
          operator: item.operator,
          value: item.value,
          entity: item.entity ?? NOT_APPLICABLE,
          type: item.type
        }
      : item;
  });
};
