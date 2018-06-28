import React from 'react';

import EditFilterForm, { getInitialForm } from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/AnalyzeFilterDialog';

export default function EditFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getInitialForm(props.tag.name, props.tag.value)}
      renderForm={formProps => <EditFilterForm {...formProps} />}
    />
  );
}
