import React from 'react';

import EditApplicationFilterForm, {
  getInitialForm
} from 'in-analyze/Dialogs/EditApplicationFilterDialog/EditApplicationFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/AnalyzeFilterDialog';

export default function EditApplicationFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getInitialForm(props.tag.name, props.tag.value)}
      renderForm={formProps => <EditApplicationFilterForm {...formProps} />}
    />
  );
}
