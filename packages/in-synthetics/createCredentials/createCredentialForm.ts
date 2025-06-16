/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, ValidationResult } from 'formalistic';

import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

const createCredentialForm = (credentialNames: string[], savedState?: Record<string, any>) => {
  savedState = savedState ?? {};

  function uniqueCredentialNameValidator(str?: string): ValidationResult {
    if (credentialNames.includes(str!)) {
      return [
        {
          severity: 'error',
          message: t('in-synthetics:dialog.createCredential.steps.textInput.credentialNamesMustBeUnique')
        }
      ];
    }

    return null;
  }

  return createMapForm({ validator: notUndefinedValidator })
    .put(
      'credentialName',
      createField({
        value: savedState?.credentialName ?? '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          credentialNameValidator,
          uniqueCredentialNameValidator
        )
      })
    )
    .put(
      'credentialValue',
      createField({
        value: savedState?.credentialValue ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'rbacTags',
      createField({
        value: savedState?.rbacTags ?? []
      })
    )
    .put(
      'applications',
      createField({
        value: savedState?.applications ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'mobileApps',
      createField({
        value: savedState?.mobileApps ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'websites',
      createField({
        value: savedState?.websites ?? [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    );
};

export function credentialNameValidator(str?: string): ValidationResult {
  const regExp = /^[A-Za-z][A-Za-z0-9_]*$/;
  if (!regExp.test(str!)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createCredential.steps.textInput.invalidText')
      }
    ];
  }

  return null;
}

export default createCredentialForm;
