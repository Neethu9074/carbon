/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SyntheticCredential } from '@instana/types';
import { Button } from '@instana/components';

import { ModalNotification } from 'in-synthetics/dashboards/global/tabs/locations/components/ModalNotification';
import { showDeleteSuccessMessage, showDeleteErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { syntheticCredentialDeleteSubmitButtonClick } from 'in-synthetics/tracking/tracker';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { NotificationState } from 'in-synthetics/utils/constants';
import { close } from 'in-components/DialogPresenter/store';
import { deleteCredential } from 'in-synthetics/api';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { isBlank } from 'in-services/util/string';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './CredentialListActionsColumn.mless';

const DeleteSelectedCredential = ({ item }: { item: SyntheticCredential }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [credentialNameInputValue, setCredentialNameInputvalue] = useState('');
  const { trackCta } = useSegmentTracking();
  const [notification, setNotification] = useState<NotificationState>({ show: false });

  const { credentialName }: SyntheticCredential = item;

  const doDeleteAction = () => {
    syntheticCredentialDeleteSubmitButtonClick(trackCta);
    setIsDeleting(true);

    const action$ = deleteCredential(credentialName);

    action$.once(() => {
      setIsDeleting(false);
      setCredentialNameInputvalue('');
      setNotification({
        show: true,
        message: t('in-synthetics:dashboard.credentialList.deleteAction.deletionSuccess'),
        variant: 'success'
      });
      showDeleteSuccessMessage('credentials');
      close();
      window.location.reload();
    });

    action$.errors().once(error => {
      setIsDeleting(false);
      showDeleteErrorMessage(deserializeErrorMessage(error.message), 'credentials');
      close();
    });
  };

  return (
    <Dialog
      title={t('in-synthetics:dashboard.credentialList.deleteAction.deleteCredentialTitle', {
        credentialName: credentialName
      })}
      className={locals.dialog}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      <section className={locals.confirmationDialogContent}>
        <Label htmlFor="credentialName">
          {t('in-synthetics:dashboard.credentialList.deleteAction.credentialNameValidation')}
          <Input
            name="credentialName"
            value={credentialNameInputValue}
            disabled={isDeleting}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              setCredentialNameInputvalue(target.value);
            }}
          />
        </Label>
        {notification.show && (
          <ModalNotification
            message={notification.message!}
            onClick={() => setNotification({ show: false })}
            variant={notification.variant}
          />
        )}
      </section>
      <section className={locals.buttons}>
        <Button kind="subtle" onClick={close}>
          {t('in-synthetics:dashboard.credentialList.deleteAction.cancelButtonLabel')}
        </Button>
        <Button
          onClick={() => {
            doDeleteAction();
          }}
          disabled={credentialNameInputValue !== credentialName || isBlank(credentialNameInputValue)}
          kind="danger"
        >
          {t('in-synthetics:dashboard.credentialList.deleteAction.deleteButtonLabel')}
        </Button>
      </section>
    </Dialog>
  );
};

export default DeleteSelectedCredential;
