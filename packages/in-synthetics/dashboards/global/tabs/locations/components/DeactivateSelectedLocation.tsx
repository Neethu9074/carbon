/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Button, Typography } from '@instana/components';
import { LocationListItem } from '@instana/types';

import {
  showLocationDeactivateErrorMessage,
  showLocationDeactivateSuccessMessage
} from 'in-synthetics/createTests/utils/userFeedback';
import { ModalNotification } from 'in-synthetics/dashboards/global/tabs/locations/components/ModalNotification';
import { NotificationState } from 'in-synthetics/utils/constants';
import { close } from 'in-components/DialogPresenter/store';
import { deactivateLocation } from 'in-synthetics/api';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { isBlank } from 'in-services/util/string';
import Dialog from 'in-components/Dialog/Dialog';
import { t, Trans } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/LocationListActionsColumn.mless';

interface Props {
  item: LocationListItem;
}

const DeactivateSelectedLocation = ({ item }: Props) => {
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [validationInputValue, setValidationInputValue] = useState('');
  const [reasonInputValue, setReasonInputvalue] = useState('');
  const [notification, setNotification] = useState<NotificationState>({ show: false });

  const locationValidation: string = 'LOCATION';

  const { id, label, linkedTests, status }: LocationListItem = item;

  const doDeactivateAction = () => {
    setIsDeactivating(true);

    const action$ = deactivateLocation(id);

    action$.once(() => {
      setIsDeactivating(false);
      setReasonInputvalue('');
      setValidationInputValue('');
      showLocationDeactivateSuccessMessage();
      close();
      window.location.reload();
    });

    action$.errors().once(error => {
      setIsDeactivating(false);
      showLocationDeactivateErrorMessage(error.message.split(':')[2]);
      close();
    });
  };

  return (
    <Dialog
      title={t('in-synthetics:dashboard.locationList.deactivateLocation.dialogTitle')}
      className={locals.dialog}
      onClose={close}
      doNotCloseOnOutsideClick
    >
      <section className={locals.confirmationDialogContent}>
        <Typography variant="body-regular">
          {linkedTests > 0 ? (
            <Trans
              i18nKey={'in-synthetics:dashboard.locationList.deactivateLocation.deactiveTestLinked'}
              values={{ label, status, linkedTests }}
            />
          ) : (
            <Trans
              i18nKey={'in-synthetics:dashboard.locationList.deactivateLocation.confirmation'}
              values={{ label, status }}
            />
          )}
        </Typography>
        <Label htmlFor="reason">
          {t('in-synthetics:dashboard.locationList.deactivateLocation.reason')}
          <Input
            name="reason"
            value={reasonInputValue}
            disabled={isDeactivating}
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
            disabled={isDeactivating}
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
            doDeactivateAction();
          }}
          disabled={validationInputValue !== locationValidation || isBlank(reasonInputValue)}
          kind="danger"
        >
          {t('in-synthetics:dashboard.locationList.deactivateLocation.deactivateButton')}
        </Button>
      </section>
    </Dialog>
  );
};

export default DeactivateSelectedLocation;
