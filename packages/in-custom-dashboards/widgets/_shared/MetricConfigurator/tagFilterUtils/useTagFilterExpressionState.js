/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import { EMPTY_EXPRESSION, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';

// Unfortunately, we persist the backend model within the form while the UI has to operate on
// the form model. This disconnect causes the form elements to be unnecessarily complicated.
export function useTagFilterExpressionState({ tagCatalogResult, onChange, form }) {
  const [tagFilterExpression, setTagFilterExpression] = useState(() => {
    const tagFilterExpression = form.get('tagFilterExpression')?.value ?? invalidMarker;
    if (isEqual(tagFilterExpression, invalidMarker)) {
      return fromBackendModel(EMPTY_EXPRESSION);
    } else {
      return fromBackendModel(tagFilterExpression);
    }
  });

  useEffect(() => {
    const field = form.get('tagFilterExpression');
    if (!field) {
      return;
    }

    let change;
    if (
      tagCatalogResult.data &&
      validateFormModel({
        formModel: tagFilterExpression,
        tagCatalog: tagCatalogResult.data
      }).isValid
    ) {
      change = toBackendQueryModel(tagFilterExpression, false);
    } else {
      change = invalidMarker;
    }

    if (!isEqual(change, field.value)) {
      onChange([], form => {
        return form.updateIn(['tagFilterExpression'], field => field.setValue(change).setTouched(true));
      });
    }
  }, [form, onChange, tagFilterExpression, tagCatalogResult.data]);

  return [tagFilterExpression, setTagFilterExpression];
}
