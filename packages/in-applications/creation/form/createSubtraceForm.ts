/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createMapForm, createField } from 'formalistic';

import { t } from '@instana/i18n-react';

import {
  defaultEvaluationGranularity,
  maxEvaluationGranularity,
  minEvaluationGranularity
} from 'in-applications/constants';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { notBlankValidator } from 'in-services/validators/string';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { SubtraceFormFields } from 'in-applications/types';

export function createSubtraceForm(subtrace?: Subtrace) {
  return createMapForm<SubtraceFormFields>({
    items: {
      name: createField({ value: subtrace?.name ?? '', validator: notBlankValidator }),
      tagFilterExpression: createField<FormModelElement[]>({ value: fromBackendModel(subtrace?.tagFilterExpression) }),
      evaluationGranularitySeconds: createField<number>({
        value: subtrace?.evaluationGranularitySeconds ?? defaultEvaluationGranularity,
        validator: val => {
          if (!val || val < minEvaluationGranularity || val > maxEvaluationGranularity) {
            return [
              {
                severity: 'error',
                message: t('in-applications:subtraces.configuration.evaluationGranularityValidationError')
              }
            ];
          }
          return null;
        }
      })
    }
  });
}
