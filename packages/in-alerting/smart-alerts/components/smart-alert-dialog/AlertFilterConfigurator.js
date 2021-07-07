/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertFilterConfigurator.mless';

export default function AlertFilterConfigurator({ QueryBuilderComponent, form, updateForm }) {
  const tagFilterExpression = form.get('tagFilterExpression')?.value;
  // NOTE: Website alert configs does not have builtIn param
  const isBuiltIn = form.get('builtIn')?.value;

  return (
    <div className={locals.queryBuilderWrapper}>
      <span className={locals.queryBuilderPositionCorrection}>
        <QueryBuilderComponent
          onChange={tfe => handleChangeTagFilterExpressionChange(tfe, form, updateForm)}
          value={tagFilterExpression}
          readOnly={isBuiltIn}
        />
      </span>
    </div>
  );
}

export const handleChangeTagFilterExpressionChange = (tagFilterExpression, form, updateForm) => {
  updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(tagFilterExpression).setTouched(true)));
};

AlertFilterConfigurator.propTypes = {
  QueryBuilderComponent: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired
};
