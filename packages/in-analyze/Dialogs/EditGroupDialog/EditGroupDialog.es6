import React from 'react';

import EditGroupFrom, { getInitialForm } from 'in-analyze/Dialogs/EditGroupDialog/EditGroupForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';

export default function EditGroupDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      title="Group"
      getInitialForm={() => getInitialForm(props.group)}
      getClearForm={() => getInitialForm({})}
      renderForm={formProps => <EditGroupFrom {...props} {...formProps} />}
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
