/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm, ValidationResult, createField, createMapForm } from 'formalistic';

import { TagFilterExpression } from '@instana/types';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function updateTagFilterExpressionValidator(
  form: MapForm<any>,
  groupId: string | null | undefined
): MapForm<any> {
  const field = form.getIn(['tagFilterExpression']);
  const optionalTagFilterExpression = groupId != null;
  return form.put(
    'tagFilterExpression',
    createField({
      value: field.value,
      touched: field.touched,
      validator: optionalTagFilterExpression ? undefined : tagFilterExpressionValidator
    })
  );
}

export function createApplicationPerspectiveForm(application: any): MapForm<any> {
  const form = createMapForm()
    .put(
      'id',
      createField({
        value: application.id
      })
    )
    .put(
      'label',
      createField({
        value: application.label,
        validator: applicationLabelValidator
      })
    )
    .put(
      'restrictingApplicationId',
      createField({
        value: application.restrictingApplicationId
      })
    )
    .put(
      'scope',
      createField({
        value: application.scope
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: application.boundaryScope
      })
    )
    .put(
      'builtInAlertIds',
      createField({
        value: application.builtInAlertIds ?? []
      })
    )
    .put(
      'tagFilterExpression',
      createField({
        value: application.tagFilterExpression ?? [],
        validator: tagFilterExpression => tagFilterExpressionValidator(tagFilterExpression)
      })
    );

  return form;
}

function applicationLabelValidator(name: string | null | undefined): ValidationResult {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: t('in-applications:creation.form.theApplicationPerspectiveNameMustNotBeBlank')
      }
    ];
  }

  if (name!.length > 128) {
    return [
      {
        severity: 'error',
        message: t('in-applications:creation.form.theApplicationPerspectiveNameMustNotBeLargerThan128Characters')
      }
    ];
  }

  return null;
}

export function tagFilterExpressionValidator(
  tagFilterExpression: TagFilterExpression[] | FormModelElement[]
): ValidationResult {
  if (tagFilterExpression.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-applications:creation.form.theQueryIsNotValid')
      }
    ];
  }
  return null;
}
