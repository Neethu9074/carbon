/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import React from 'react';

import { Message, MessageTypes } from '@instana/components';

import SelectListDialogContent from 'in-settings/tabs/TeamSettings/components/SelectListDialogContent';
import { deprecateAppDataLegacyEvents } from 'in-services/featureFlags';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
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
    <Dialog
      title={title}
      renderCustomCloseBehaviour={() =>
        deprecateAppDataLegacyEvents ? (
          <Message type={MessageTypes.neutral} small withIcon>
            {t('in-settings:tabs.depreactedEventHiddenInfo')}
          </Message>
        ) : null
      }
      onClose={close}
      className={locals.dialog}
    >
      <SelectListDialogContent {...props} />
    </Dialog>
  );
}
