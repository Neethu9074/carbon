/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import React from 'react';

import SelectListDialogContent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './SelectListDialog.mless';

const defaultRequiresAtLeastOneMessage = t('in-settings:tabs.pleaseSelectAtLeastOneItem');

export default compose(
  withState('selectedItems', 'setSelectedItems', []),
  withState('errorMessage', 'setErrorMessage', ({ requiresAtLeastOneMessage }) =>
    requiresAtLeastOneMessage ? requiresAtLeastOneMessage : defaultRequiresAtLeastOneMessage
  )
)(SelectListDialog);

function SelectListDialog(props) {
  const { title = t('in-settings:tabs.select') } = props;
  return (
    <Dialog title={title} onClose={close} className={locals.dialog}>
      <SelectListDialogContent {...props} />
    </Dialog>
  );
}
