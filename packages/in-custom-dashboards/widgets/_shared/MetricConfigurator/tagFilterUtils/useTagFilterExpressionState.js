/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useState, useEffect } from 'react';
import { isEqual } from 'lodash';

import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { isFormModelValid } from 'in-new-components/QueryBuilder/validation/formModel';

// Unfortunately, we persist the backend model within the form while the UI has to operate on
// the form model. This disconnect causes the form elements to be unnecessarily complicated.
export function useTagFilterExpressionState({ tagCatalogResult, onChange, form }) {
  const [tagFilterExpression, setTagFilterExpression] = useState(() => {
    const tagFilterExpression = form.get('tagFilterExpression').value;
    if (isEqual(tagFilterExpression, invalidMarker)) {
      return fromBackendModel(EMPTY_EXPRESSION);
    } else {
      return fromBackendModel(tagFilterExpression);
    }
  });

  useEffect(() => {
    let change;
    if (
      tagCatalogResult.data &&
      isFormModelValid({
        formModel: tagFilterExpression,
        tagCatalog: tagCatalogResult.data
      })
    ) {
      change = toBackendQueryModel(tagFilterExpression, false);
    } else {
      change = invalidMarker;
    }

    if (!isEqual(change, form.get('tagFilterExpression').value)) {
      onChange([], form => {
        return form.updateIn(['tagFilterExpression'], field => field.setValue(change).setTouched(true));
      });
    }
  }, [form, onChange, tagFilterExpression, tagCatalogResult.data]);

  return [tagFilterExpression, setTagFilterExpression];
}
