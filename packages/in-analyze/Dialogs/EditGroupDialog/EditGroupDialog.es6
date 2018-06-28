import React from 'react';

import EditGroupFrom, { getInitialForm } from 'in-analyze/Dialogs/EditGroupDialog/EditGroupForm';
import AnalyzeFilterDialog from 'in-analyze/Dialogs/AnalyzeFilterDialog';

export default function EditGroupDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      title="Group"
      getInitialForm={() => getInitialForm(props.group)}
      renderForm={formProps => <EditGroupFrom {...formProps} />}
    />
  );
}
