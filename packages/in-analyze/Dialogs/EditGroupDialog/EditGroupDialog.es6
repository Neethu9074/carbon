import React from 'react';

import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import EditGroupFrom from 'in-analyze/Dialogs/EditGroupDialog/EditGroupForm';
import withTagSuggestions from 'in-analyze/Dialogs/withTagSuggestions';

export default withTagSuggestions()(EditGroupDialog);

function EditGroupDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      title="Group"
      validateValue={false}
      renderForm={formProps => <EditGroupFrom {...props} {...formProps} />}
    />
  );
}
