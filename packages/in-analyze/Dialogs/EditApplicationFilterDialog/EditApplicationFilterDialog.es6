import { compose } from 'recompose';
import React from 'react';

import EditApplicationFilterForm from 'in-analyze/Dialogs/EditApplicationFilterDialog/EditApplicationFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import withTagSuggestions from 'in-analyze/Dialogs/withTagSuggestions';

export default compose(withTagSuggestions())(EditApplicationFilterDialog);

function EditApplicationFilterDialog(props) {
  return (
    <AnalyzeFilterDialog {...props} renderForm={formProps => <EditApplicationFilterForm {...props} {...formProps} />} />
  );
}
