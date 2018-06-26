import React from 'react';

import EditFilterForm, { getTagEditForm } from 'in-analyze/Filter/Dialogs/EditFilterDialog/EditFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Filter/Dialogs/AnalyzeFilterDialog';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';

export default function EditFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getTagEditForm(props.tag.name, props.tag.value)}
      renderForm={formProps => <EditFilterForm {...formProps} />}
      onChange={onChange}
    />
  );
}

function onChange(form, fieldName, value) {
  if (fieldName === 'name') {
    const node = findSubTreeByFullyQualifiedName(value);
    if (node && node.type) {
      form = form.updateIn(['type'], field => field.setValue(node.type).setTouched(true));

      form = form.updateIn(['customNameSubform'], subForm => {
        const updatedSubForm = subForm.value.updateIn(['type'], field => field.setValue(node.type).setTouched(true));
        return subForm.setValue(updatedSubForm).setTouched(true);
      });
    }
  }
  return form;
}
