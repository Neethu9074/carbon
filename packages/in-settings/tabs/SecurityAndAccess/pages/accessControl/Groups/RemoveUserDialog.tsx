/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { removeUserFromGroupWithoutMapAndRefresh as removeUserFromGroup } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { close } from 'in-components/DialogPresenter/store';
import { Trans, t } from 'in-i18n';
import { Error } from 'in-types';

/**
 * Properties for the RemoveUserDialog component
 *
 * @interface Props
 * @field {string} groupId current group id from which the user pot. is removed
 * @field {string} userId to (pot.) be removed
 * @field {string} username to be shown in ConfirmationDialog
 * @field {() => void} removeLocally callback to remove the user from the previous screen
 * @field {() => void} close callback to close the current Dialogue
 * @field {(string => void} setErrorMessage to set the error message on the previous screen
 */
interface Props {
  groupId: string;
  userId: string;
  username: string;
  removeLocally: () => {};
}

/**
 * @param status Verifies if the status is a okayisch status
 *
 * @returns true if ok
 */
const isStatusOk = (status: any) => Number.isInteger(status) && status > 199 && status < 300;

/**
 * Actual component
 * @param {Props} param0 containing all properties
 * @returns React component
 */
export function RemoveUserDialog({ groupId, userId, username, removeLocally }: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error[] | undefined>();

  /**
   * handles the actual submit
   * (send changes to backend, pot. display error messages & closes dialog)
   */
  const onSubmit = () => {
    setIsSaving(true);

    /**
     * handles any error case by setting messages and closing the dialog
     */
    const handleFailure = () => {
      const message = t('in-settings:tabs.failedToRemoveUserFromGroupWithoutDetails');
      setErrors([{ code: 'SERVER', message }]);
      setIsSaving(false);
    };
    removeUserFromGroup(groupId, userId).once(data => {
      if (isStatusOk(data.status)) {
        setIsSaving(false);
        removeLocally();
        close();
      } else {
        handleFailure();
      }
    }, handleFailure);
  };

  return (
    <ConfirmationDialog
      header={t('in-settings:components.pleaseConfirm')}
      description={<Trans i18nKey="in-settings:components.confirmRemoveItem" values={{ itemName: username }} />}
      isSaving={isSaving}
      onSubmit={onSubmit}
      errors={errors}
      confirmButtonLabel={t('in-settings:tabs.remove')}
      confirmButtonKind="danger"
      confirmButtonAutoFocus
    />
  );
}
