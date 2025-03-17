/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

import { AssertionTargetFilter } from 'in-synthetics/utils/constants';

export const DNSErrorsExist = (
  configForm: MapForm<any>,
  syntheticTypeField: Field<string>,
  targetFilters: AssertionTargetFilter[]
) => {
  if (syntheticTypeField.value === 'DNS') {
    const fieldsToBeValidated = ['lookup', 'lookupServerName', 'port', 'server', 'queryTime', 'serverRetries'];
    if (
      fieldsToBeValidated.some((fieldName: string) => {
        const field = configForm.get(fieldName);
        return field && !field.valid;
      })
    ) {
      return true;
    }
    return (
      configForm.get('targetValues') &&
      targetFilters.some(
        targetFilter =>
          targetFilter.error.key.invalid || targetFilter.error.operator.invalid || targetFilter.error.value.invalid
      )
    );
  }
  return undefined;
};
