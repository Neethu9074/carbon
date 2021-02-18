/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { getApplicationIdTagFilter } from 'in-applications/alerting/data/entitySelection';

import locals from './FilterConfigurator.mless';

export default function FilterConfigurator({
  QueryBuilderComponent,
  form,
  updateForm,
  formFieldName,
  ...remainingProps
}) {
  const applicationId = form.get('applicationId').value;
  const boundaryScope = form.get('boundaryScope').value;

  return (
    <div className={locals.querybuilderLayoutWrapper}>
      <QueryBuilderComponent
        {...remainingProps}
        value={form.get(formFieldName)?.value}
        onChange={tfe => updateForm(form.updateIn([formFieldName], f => f.setValue(tfe).setTouched(true)))}
        additionalTagSuggestionFilters={[getApplicationIdTagFilter(boundaryScope, applicationId)]}
      />
    </div>
  );
}

FilterConfigurator.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  formFieldName: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};
