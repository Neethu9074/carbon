/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import SelectListDialogContent from 'in-settings/tabs/GlobalSettings/components/SelectListDialogContent';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './SelectListDialog.mless';

const defaultRequiresAtLeastOneMessage = t('in-settings:tabs.pleaseSelectAtLeastOneItem');

export default function SelectListDialog(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState(
    props.requiresAtLeastOneMessage ? props.requiresAtLeastOneMessage : defaultRequiresAtLeastOneMessage
  );
  const { title = t('in-settings:tabs.select'), renderCustomCloseBehaviour } = props;
  return (
    <Dialog
      title={title}
      renderCustomCloseBehaviour={renderCustomCloseBehaviour}
      onClose={close}
      className={locals.dialog}
    >
      <SelectListDialogContent
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        {...props}
      />
    </Dialog>
  );
}
