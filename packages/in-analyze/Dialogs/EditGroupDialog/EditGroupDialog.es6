import React from 'react';

import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import EditGroupFrom from 'in-analyze/Dialogs/EditGroupDialog/EditGroupForm';

export default function EditGroupDialog(props) {
  return (
    <AnalyzeFilterDialog
      {...props}
      title="Group"
      withValue={false}
      renderForm={formProps => (
        <EditGroupFrom {...props} {...formProps} helpText="Select a tag by which your calls should be grouped." />
      )}
    />
  );
}
