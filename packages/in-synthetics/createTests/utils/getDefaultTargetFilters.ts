/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm, Item } from 'formalistic';
import { isEmpty } from 'lodash';

import { generateUniqueShortId } from '@instana/utils';

import { AssertionTargetFilter, Invalid, TargetFilter } from 'in-synthetics/utils/constants';
import { isNotBlank } from 'in-services/util/string';

export const getDefaultTargetFilters = () => {
  return [
    {
      id: generateUniqueShortId(),
      key: '',
      operator: '',
      value: '',
      error: {
        key: {
          invalid: false,
          message: ''
        },
        operator: {
          invalid: false,
          message: ''
        },
        value: {
          invalid: false,
          message: ''
        }
      },
      inValidResolutionRecord: false
    }
  ];
};

export const getTargetFilters = (form: MapForm<any>, fieldName: string) => {
  const targetFilters = form.get('configuration')?.get(fieldName)
    ? (form.get('configuration')?.get(fieldName) as Field<AssertionTargetFilter[]>)?.value
    : [];
  if (targetFilters.length > 0)
    return targetFilters.map(item => {
      return {
        ...item,
        id: generateUniqueShortId(),
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        },
        inValidResolutionRecord: false
      };
    });
  else {
    return [
      {
        id: generateUniqueShortId(),
        key: '',
        operator: '',
        value: '',
        error: {
          key: {
            invalid: false,
            message: ''
          },
          operator: {
            invalid: false,
            message: ''
          },
          value: {
            invalid: false,
            message: ''
          }
        },
        inValidResolutionRecord: false
      }
    ];
  }
};

export function getUpdatedTargetFilter(form: MapForm<any>, fieldName: string): MapForm<any> {
  if (isEmpty(form.get('configuration').get(fieldName).value)) {
    return form.put('configuration', form.get('configuration').remove(fieldName));
  } else {
    const updatedFilter = form
      .get('configuration')
      .get(fieldName)
      .value.map(({ id, error, ...otherValues }: { id: string; error: Invalid }) => otherValues)
      .filter((targetValue: TargetFilter) => isNotBlank(targetValue.key));
    return form.updateIn(['configuration', fieldName], (field: Item) =>
      (field as Field<TargetFilter>).setValue(updatedFilter).setTouched(true)
    );
  }
}
