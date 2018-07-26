import { compose } from 'recompose';
import React from 'react';

import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import EditFilterForm from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';
import withTagSuggestions from 'in-analyze/Dialogs/withTagSuggestions';

export default compose(withTagSuggestions())(EditFilterDialog);

function EditFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      title="Filter"
      renderForm={formProps => <EditFilterForm {...props} {...formProps} />}
    />
  );
}
