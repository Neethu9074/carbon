/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, ValidationResult } from 'formalistic';

import { SyntheticCredential } from '@instana/types';

import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

const editCredentialForm = (item: SyntheticCredential) => {
  return createMapForm({ validator: notUndefinedValidator })
    .put(
      'credentialName',
      createField({
        value: item?.credentialName ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'credentialValue',
      createField({
        value: item?.credentialValue ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notEmptyValidator)
      })
    )
    .put(
      'rbacTags',
      createField({
        value: item?.rbacTags ?? []
      })
    )
    .put(
      'applications',
      createField({
        value: item?.applications ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'mobileApps',
      createField({
        value: item?.mobileApps ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'websites',
      createField({
        value: item?.websites ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    );
};

export default editCredentialForm;

function notEmptyValidator(str?: string): ValidationResult {
  if (str?.trim().length === 0 && str?.length > 0) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dashboard.credentialList.editAction.theValueMustNotBeBlank')
      }
    ];
  }

  return null;
}
