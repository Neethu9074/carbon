/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Message, Typography, Link } from '@instana/components';
import { LocationListItem } from '@instana/types';
import { Button } from '@instana/components';

import { ModalNotification } from 'in-synthetics/dashboards/global/tabs/locations/components/ModalNotification';
import { showDeleteSuccessMessage, showDeleteErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { NotificationState } from 'in-synthetics/utils/constants';
import { close } from 'in-components/DialogPresenter/store';
import { deleteLocation } from 'in-synthetics/api';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { isBlank } from 'in-services/util/string';
import Dialog from 'in-components/Dialog/Dialog';
import { t, Trans } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/LocationListActionsColumn.mless';

interface Props {
  item: LocationListItem;
}

const DeleteSelectedLocation = ({ item }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationInputValue, setValidationInputValue] = useState('');
  const [reasonInputValue, setReasonInputvalue] = useState('');
  const [notification, setNotification] = useState<NotificationState>({ show: false });

  const locationValidation: string = 'LOCATION';
  const documentUrl = 'https://ibm.biz/pop_upgrade';

  const { id, label, linkedTests, status }: LocationListItem = item;

  const doDeleteAction = () => {
    setIsDeleting(true);

    const action$ = deleteLocation(id);

    action$.once(() => {
      setIsDeleting(false);
      setReasonInputvalue('');
      setValidationInputValue('');
      setNotification({
        show: true,
        message: t('in-synthetics:dashboard.locationList.deletionSuccess'),
        variant: 'success'
      });
      showDeleteSuccessMessage('location');
      close();
      window.location.reload();
    });

    action$.errors().once(error => {
      setIsDeleting(false);
      showDeleteErrorMessage(error.message.split(':')[2], 'location');
      close();
    });
  };

  return (
    <Dialog
      title={t('in-synthetics:dashboard.locationList.deleteLocationLabel')}
      className={locals.dialog}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      <section className={locals.confirmationDialogContent}>
        <Typography variant="body-regular">
          {linkedTests > 0 ? (
            <Trans
              i18nKey={'in-synthetics:dashboard.locationList.activeTestLinked'}
              values={{ label, status, linkedTests }}
              components={{
                // @ts-expect-error required prop children will be filled via i18n translation
                documentLink: <Link href={documentUrl} external />
              }}
            />
          ) : (
            <Trans
              i18nKey={'in-synthetics:dashboard.locationList.labelConfirmRemoveLocation'}
              values={{ label, status }}
            />
          )}
        </Typography>
        <Message type="warning" withIcon inline>
          {t('in-synthetics:dashboard.locationList.deleteLocationBroswerRefreshInfo')}
        </Message>
        <Label htmlFor="reason">
          {t('in-synthetics:dashboard.locationList.deletionReason')}
          <Input
            name="reason"
            value={reasonInputValue}
            disabled={isDeleting}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              setReasonInputvalue(target.value);
            }}
          />
        </Label>
        <Label htmlFor="typingValidation">
          {t('in-synthetics:dashboard.locationList.typeToContinue', {
            location: locationValidation
          })}
          <Input
            name="typingValidation"
            placeholder={locationValidation}
            value={validationInputValue}
            disabled={isDeleting}
            onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
              setValidationInputValue(target.value);
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
          {t('in-synthetics:dashboard.locationList.cancelButton')}
        </Button>
        <Button
          onClick={() => {
            doDeleteAction();
          }}
          disabled={validationInputValue !== locationValidation || isBlank(reasonInputValue)}
          kind="danger"
        >
          {t('in-synthetics:dashboard.locationList.deleteLocationLabel')}
        </Button>
      </section>
    </Dialog>
  );
};

export default DeleteSelectedLocation;
