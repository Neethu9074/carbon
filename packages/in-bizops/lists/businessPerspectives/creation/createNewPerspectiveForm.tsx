/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  ValidationResult,
  createField,
  createMapForm,
  MapForm,
  notBlankValidator,
  composeValidators
} from 'formalistic';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MAX_DESCRIPTION_SIZE, MAX_NAME_SIZE } from 'in-bizops/utils/constants';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { PerspectiveItem } from 'in-bizops/utils/types';
import { t } from 'in-i18n';

interface FormProps {
  perspective: PerspectiveItem;
}

const emptyForm: FormProps = {
  perspective: {
    tagFilterExpression: [],
    name: '',
    description: ''
  }
};

const createNewPerspectiveForm = ({ perspective }: FormProps = emptyForm): MapForm<any> => {
  return createMapForm()
    .put(
      'tagFilterExpression',
      createField<FormModelElement[]>({
        value: (perspective.tagFilterExpression || []) as FormModelElement[],
        validator: tagFilterExpressionValidator
      })
    )
    .put(
      'perspectiveName',
      createField({
        value: perspective.name,
        validator: composeValidators(stringMaxLengthValidator(MAX_NAME_SIZE), notBlankValidator)
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
  if (tagFilterExpression.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-bizops:perspectives.errorMessages.tagFilterExpressionMustNotBeEmpty')
      }
    ];
  }

  return null;
}
