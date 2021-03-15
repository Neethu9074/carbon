/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertFilterConfigurator.mless';

export default function AlertFilterConfigurator({ QueryBuilderComponent, form, updateForm, ...remainingProps }) {
  const tagFilterExpression = form.get('tagFilterExpression')?.value;

  return (
    <div className={locals.queryBuilderWrapper}>
      <span className={locals.queryBuilderPositionCorrection}>
        <QueryBuilderComponent
          {...remainingProps}
          onChange={tfe => handleChangeTagFilterExpressionChange(tfe, form, updateForm)}
          value={tagFilterExpression}
        />
      </span>
    </div>
  );
}

export const handleChangeTagFilterExpressionChange = (tagFilterExpression, form, updateForm) => {
  updateForm(
    form
      .updateIn(['tagFilterExpression'], f => f.setValue(tagFilterExpression).setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
  );
};

AlertFilterConfigurator.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  moveClearActionLeft: PropTypes.bool
};
