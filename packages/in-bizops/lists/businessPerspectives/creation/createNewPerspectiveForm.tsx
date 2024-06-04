/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult, createField, createMapForm, MapForm } from 'formalistic';

import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const createNewPerspectiveForm = (): MapForm<any> => {
  const form = createMapForm()
    .put(
      'tagFilterExpression',
      createField({
        value: [],
        validator: tagFilterExpressionValidator
      })
    )
    .put(
      'perspectiveName',
      createField({
        value: '',
        validator: perspectiveNameValidator
      })
    )
    .put(
      'perspectiveDescription',
      createField({
        value: '',
        validator: perspectiveDescriptionValidator
      })
    );

  return form;
};

export default createNewPerspectiveForm;

//TODO! Implement validators
function tagFilterExpressionValidator(): ValidationResult {
  return null;
}

function perspectiveNameValidator(name: any): ValidationResult {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: t('in-bizops:perspectives.errorMessages.businessPerspectiveNameMustNotBeBlank')
      }
    ];
  }

  return null;
}

function perspectiveDescriptionValidator(): ValidationResult {
  return null;
}
