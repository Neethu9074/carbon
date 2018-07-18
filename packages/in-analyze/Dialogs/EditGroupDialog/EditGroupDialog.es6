import React from 'react';

import EditGroupFrom, { getInitialForm } from 'in-analyze/Dialogs/EditGroupDialog/EditGroupForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';

export default function EditGroupDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      title="Group"
      getInitialForm={() => {
        const initialForm = getInitialForm(props);
        return initialForm;
      }}
      getClearForm={() => getInitialForm({})}
      renderForm={formProps => <EditGroupFrom {...props} {...formProps} />}
      onChangeCallback={(form, fieldName, value) =>
        onChangeCallback(form, fieldName, value, props.setNameForTagSuggestion)
      }
    />
  );
}

function onChangeCallback(form, fieldName, value) {
  if (fieldName === 'name') {
    form = form.updateIn(['customNameSubform'], subForm => {
      const updatedSubForm = subForm.value.updateIn(['name'], field => field.setValue(value).setTouched(true));
      return subForm.setValue(updatedSubForm).setTouched(true);
    });
  }
  return form;
}
