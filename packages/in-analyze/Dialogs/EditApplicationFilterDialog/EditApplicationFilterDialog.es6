import { compose } from 'recompose';
import React from 'react';

import EditApplicationFilterForm, {
  getInitialForm
} from 'in-analyze/Dialogs/EditApplicationFilterDialog/EditApplicationFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import withTagSuggestions from 'in-analyze/Dialogs/withTagSuggestions';

export default compose(withTagSuggestions())(EditApplicationFilterDialog);

function EditApplicationFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getInitialForm(props.name, props.value)}
      renderForm={formProps => <EditApplicationFilterForm {...props} {...formProps} />}
    />
  );
}

export function getEndpointTypesComboBoxItems(autoCompletedValuesResult) {
  if (!autoCompletedValuesResult.data) {
    return [];
  }

  return autoCompletedValuesResult.data.suggestions.map(suggestion => ({
    value: suggestion,
    label: suggestion
  }));
}
