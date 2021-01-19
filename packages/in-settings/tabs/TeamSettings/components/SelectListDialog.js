/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withState } from 'recompose';
import React from 'react';

import SelectListDialogContent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';

import locals from './SelectListDialog.mless';

const defaultRequiresAtLeastOneMessage = 'Please select at least one item.';

export default compose(
  withState('selectedItems', 'setSelectedItems', []),
  withState('errorMessage', 'setErrorMessage', ({ requiresAtLeastOneMessage }) =>
    requiresAtLeastOneMessage ? requiresAtLeastOneMessage : defaultRequiresAtLeastOneMessage
  )
)(SelectListDialog);

function SelectListDialog(props) {
  const { title = 'Select' } = props;
  return (
    <Dialog title={title} onClose={close} className={locals.dialog}>
      <SelectListDialogContent {...props} />
    </Dialog>
  );
}
