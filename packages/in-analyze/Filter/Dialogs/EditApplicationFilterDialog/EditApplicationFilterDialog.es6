import React from 'react';

import EditApplicationFilterForm, {
  getTagEditForm
} from 'in-analyze/Filter/Dialogs/EditApplicationFilterDialog/EditApplicationFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Filter/Dialogs/AnalyzeFilterDialog';

export default function EditApplicationFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getTagEditForm(props.tag.name, props.tag.value)}
      renderForm={formProps => <EditApplicationFilterForm {...formProps} />}
    />
  );
}
