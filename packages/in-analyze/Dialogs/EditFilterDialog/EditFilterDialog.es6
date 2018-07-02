import React from 'react';

import EditFilterForm, { getInitialForm } from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/AnalyzeFilterDialog';

export default function EditFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getInitialForm(props.tag.name, props.tag.value)}
      renderForm={formProps => <EditFilterForm {...props} {...formProps} />}
      onChange={onChange}
    />
  );
}

function onChange(form, fieldName, value) {
  if (fieldName === 'name') {
    form = form.updateIn(['customNameSubform'], subForm => {
      const updatedSubForm = subForm.value.updateIn(['name'], field => field.setValue(value).setTouched(true));
      return subForm.setValue(updatedSubForm).setTouched(true);
    });
  }

  return form;
}
