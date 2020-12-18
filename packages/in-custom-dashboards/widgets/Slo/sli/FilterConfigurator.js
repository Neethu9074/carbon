import PropTypes from 'prop-types';
import React from 'react';

import locals from './FilterConfigurator.mless';

export default function FilterConfigurator({
  QueryBuilderComponent,
  form,
  updateForm,
  formFieldName,
  ...remainingProps
}) {
  return (
    <div className={locals.querybuilderLayoutWrapper}>
      <QueryBuilderComponent
        {...remainingProps}
        value={form.get(formFieldName)?.value}
        onChange={tfe => updateForm(form.updateIn([formFieldName], f => f.setValue(tfe).setTouched(true)))}
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
