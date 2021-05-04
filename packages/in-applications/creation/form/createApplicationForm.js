/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';

import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function removeMatchSpecification(i, form, updateForm) {
  updateForm(form.updateIn(['matchSpecification'], list => list.remove(i).setTouched(true)));
}

export function createApplicationPerspectiveForm(application) {
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
    );

  return form.put(
    'tagFilterExpression',
    createField({
      value: application.tagFilterExpression ?? [],
      validator: tagFilterExpression => tagFilterExpressionValidator(tagFilterExpression)
    })
  );
}

function applicationLabelValidator(name) {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: t('in-applications:creation.form.theApplicationPerspectiveNameMustNotBeBlank')
      }
    ];
  }

  if (name.length > 128) {
    return [
      {
        severity: 'error',
        message: t('in-applications:creation.form.theApplicationPerspectiveNameMustNotBeLargerThan128Characters')
      }
    ];
  }

  return null;
}

function tagFilterExpressionValidator(tagFilterExpression) {
  if (tagFilterExpression.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-applications:creation.form.theQueryIsNotValid')
      }
    ];
  }
}
