/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import { AssertionTargetFilter } from 'in-synthetics/utils/constants';

export const getDefaultTargetFilters = (form: MapForm<any>) => {
  const targetFilters = form.get('configuration')?.get('targetValues')
    ? (form.get('configuration')?.get('targetValues') as Field<AssertionTargetFilter[]>)?.value
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
        }
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
        }
      }
    ];
  }
};
