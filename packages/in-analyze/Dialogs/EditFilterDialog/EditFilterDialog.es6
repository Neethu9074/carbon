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
      getInitialForm={() => {
        const initialForm = getInitialForm(props);
        return initialForm;
      }}
      getClearForm={() => getInitialForm()}
      renderForm={formProps => <EditFilterForm {...props} {...formProps} />}
      onChangeCallback={(form, fieldName, value) =>
        onChangeCallback(form, fieldName, value, props.setNameForTagSuggestion, props.set2ndLevelNameForTagSuggestion)
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

    form = form.updateIn(['value'], field => field.setValue('').setTouched(true));

    const newType = get(findSubTreeByFullyQualifiedName(value), ['type']);
    const operator = newType ? get(TAG_TYPES, [newType, 'operators', 0], null) : null;
    form = form.updateIn(['operator'], field => field.setValue(operator).setTouched(true));
  }

  return form;
}
