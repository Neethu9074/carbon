import React from 'react';

import EditFilterForm, { getTagEditForm } from 'in-analyze/Filter/Dialogs/EditFilterDialog/EditFilterForm';
import AnalyzeFilterDialog from 'in-analyze/Filter/Dialogs/AnalyzeFilterDialog';

export default function EditFilterDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      getInitialForm={() => getTagEditForm(props.tag.name, props.tag.value)}
      renderForm={formProps => <EditFilterForm {...formProps} />}
    />
  );
}
