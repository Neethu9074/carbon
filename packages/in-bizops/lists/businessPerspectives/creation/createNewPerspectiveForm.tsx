/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult, createField, createMapForm, MapForm } from 'formalistic';

import { PerspectiveFormItem } from 'in-bizops/types';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface FormProps {
  perspective?: PerspectiveFormItem;
}

const emptyForm: FormProps = {
  perspective: {
    description: '',
    label: '',
    tagFilterExpression: []
  }
};

const createNewPerspectiveForm = ({ perspective }: FormProps = emptyForm): MapForm<any> => {
  return createMapForm()
    .put(
      'tagFilterExpression',
      createField({
        value: perspective?.tagFilterExpression,
        validator: tagFilterExpressionValidator
      })
    )
    .put(
      'perspectiveName',
      createField({
        value: perspective?.label,
        validator: perspectiveNameValidator
      })
    )
    .put(
      'perspectiveDescription',
      createField({
        value: perspective?.description,
        validator: perspectiveDescriptionValidator
      })
    );
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
