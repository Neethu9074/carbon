/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, createListForm, notBlankValidator } from 'formalistic';
import { get } from 'lodash';

import { newAnalyticsEnabled, qb2InAPCreationEnabled } from 'in-services/featureFlags';
import { matchSpecificationValidator } from 'in-applications/Forms/BasicForm';
import { entityTypes } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';

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

  if (newAnalyticsEnabled && qb2InAPCreationEnabled) {
    return form.put(
      'tagFilterExpression',
      createField({
        value: application.tagFilterExpression ?? [],
        validator: tagFilterExpression => tagFilterExpressionValidator(tagFilterExpression)
      })
    );
  } else {
    return form.put(
      'matchSpecification',
      get(application, 'matchSpecification', []).reduce(
        (form, matchSpecification) => form.push(getEnrichedMatchSpecificationForm(matchSpecification)),
        createListForm({
          validator: matchSpecificationValidator
        })
      )
    );
  }
}

function getMatchSpecificationForm(matchSpecification = {}) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: get(matchSpecification, 'key', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'entity',
      createField({
        value: get(matchSpecification, 'entity', entityTypes.NOT_APPLICABLE),
        validator: notBlankValidator
      })
    )
    .put(
      'secondLevelName',
      createField({
        value: get(matchSpecification, 'secondLevelName', '')
      })
    )
    .put(
      'value',
      createField({
        value: get(matchSpecification, 'value', '')
      })
    )
    .put(
      'operator',
      createField({
        value: get(matchSpecification, 'operator', 'EQUALS')
      })
    );
}

function getEnrichedMatchSpecificationForm(matchSpecification) {
  return getMatchSpecificationForm(matchSpecification).put(
    'conjunction',
    createField({
      value: get(matchSpecification, 'conjunction', 'AND')
    })
  );
}

function applicationLabelValidator(name) {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: 'The application perspective name must not be blank.'
      }
    ];
  }

  if (name.length > 128) {
    return [
      {
        severity: 'error',
        message: 'The application perspective name must not be larger than 128 characters.'
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
        message: 'The query is not valid.'
      }
    ];
  }
}
