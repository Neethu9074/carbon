import { get } from 'lodash';
import React from 'react';

import EditFilterForm, { getInitialForm } from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { TAG_TYPES } from 'in-analyze/applicationFilter';

export default function EditFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getInitialForm(props.tag)}
      getClearForm={() => getInitialForm()}
      renderForm={formProps => <EditFilterForm {...props} {...formProps} />}
      onChangeCallback={onChangeCallback}
    />
  );
}

function onChangeCallback(form, fieldName, value) {
  if (fieldName === 'name') {
    form = form.updateIn(['customNameSubform'], subForm => {
      const updatedSubForm = subForm.value.updateIn(['name'], field => field.setValue(value).setTouched(true));
      return subForm.setValue(updatedSubForm).setTouched(true);
    });

    form = form.updateIn(['value'], field => field.setValue('').setTouched(true));

    const newType = get(findSubTreeByFullyQualifiedName(value), ['type']);
    const oldType = get(findSubTreeByFullyQualifiedName(form.get('name').value), ['type']);

    if (newType !== oldType) {
      const type = newType || oldType;
      const operator = get(TAG_TYPES, [type, 'operators', 0], null);
      form = form.updateIn(['operator'], field => field.setValue(operator).setTouched(true));
    }
  }

  return form;
}
