import { compose } from 'recompose';
import React from 'react';

import AnalyzeFilterDialog from 'in-analyze/Dialogs/components/AnalyzeFilterDialog';
import EditFilterForm from 'in-analyze/Dialogs/EditFilterDialog/EditFilterForm';
import withTagSuggestions from 'in-analyze/Dialogs/withTagSuggestions';
import { getAnalyzeFilterTagKeys } from 'in-applications/tags';

export default compose(withTagSuggestions())(EditFilterDialog);

function EditFilterDialog(props) {
  const isNewFilter = !props.name && !props.value;
  const keys = props.keys || getAnalyzeFilterTagKeys();

  return (
    <AnalyzeFilterDialog
      {...props}
      title="Filter"
      renderForm={formProps => (
        <EditFilterForm
          {...props}
          {...formProps}
          keys={keys}
          helpText={`${
            isNewFilter
              ? 'Select a tag by which your calls should be filtered.'
              : 'Change the tag by which your calls should be filtered.'
          } Tags are case-sensitive.`}
        />
      )}
    />
  );
}
