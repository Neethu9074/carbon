import React from 'react';

import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import EditFilterForm from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';

export default function EditFilterDialog(props) {
  return <AnalyzeFilterDialog {...props} renderForm={formProps => <EditFilterForm {...props} {...formProps} />} />;
}
