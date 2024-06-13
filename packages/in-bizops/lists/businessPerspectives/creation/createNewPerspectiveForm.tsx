/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult, createField, createMapForm, MapForm, notBlankValidator } from 'formalistic';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { MAX_DESCRIPTION_SIZE } from './NewPerspectiveFormStepTwo';
import { PerspectiveFormItem } from 'in-bizops/types';
import { t } from 'in-i18n';

interface FormProps {
  perspective: PerspectiveFormItem;
}

const emptyForm: FormProps = {
  perspective: {
    tagFilterExpression: [],
    label: '',
    description: ''
  }
};

const createNewPerspectiveForm = ({ perspective }: FormProps = emptyForm): MapForm<any> => {
  return createMapForm()
    .put(
      'tagFilterExpression',
      createField<FormModelElement[]>({
        value: perspective.tagFilterExpression,
        validator: tagFilterExpressionValidator
      })
    )
    .put(
      'perspectiveName',
      createField({
        value: perspective.label,
        validator: notBlankValidator
      })
    )
    .put(
      'perspectiveDescription',
      createField({
        value: perspective.description,
        validator: stringMaxLengthValidator(MAX_DESCRIPTION_SIZE)
      })
    );
};

export default createNewPerspectiveForm;

function tagFilterExpressionValidator(tagFilterExpression: FormModelElement[]): ValidationResult {
  if (!tagFilterExpression.length) {
    return [
      {
        severity: 'error',
        message: t('in-bizops:perspectives.errorMessages.tagFilterExpressionMustNotBeEmpty')
      }
    ];
  }

  return null;
}
