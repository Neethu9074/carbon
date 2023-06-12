/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { Button, Typography } from '@instana/components';
import { LocationListItem } from '@instana/types';
import { Link } from '@instana/legacy';

// @ts-expect-error Could not find a declaration file
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { ModalNotification } from 'in-synthetics/dashboards/global/tabs/locations/components/ModalNotification';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import { NotificationState } from 'in-synthetics/utils/constants';
import IconButton from 'in-components/IconButton/IconButton';
import { stopPropagation } from 'in-services/util/function';
import { deleteLocation } from 'in-synthetics/api';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { isBlank } from 'in-services/util/string';
import Dialog from 'in-components/Dialog/Dialog';
import { t, Trans } from 'in-i18n';

import locals from './LocationListActionsColumn.mless';

type LocationListActionsColumnProps = {
  item: LocationListItem;
  isLoading: boolean;
};

export default function LocationListActionsColumn({ item, isLoading }: LocationListActionsColumnProps) {
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);
  const { id, label, linkedTests, status }: LocationListItem = item;
  const documentUrl = 'https://www.ibm.com/docs/en/instana-observability/current?topic=beta-pop-deployment#upgrade';

  useEffect(() => {
    if (!isLoading && isMoreMenuSaving) {
      setIsMoreMenuSaving(false);
    }
    // We only want to fire the hook when is loading changes to ensure that we
    // reset the loading spinner when the new entities are loaded from backend
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  function showDeleteDialog() {
    return addActiveDialog(<DeleteSelectedLocation />);
  }

  function DeleteSelectedLocation() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [validationInputValue, setValidationInputValue] = useState('');
    const [reasonInputValue, setReasonInputvalue] = useState('');
    const [notification, setNotification] = useState<NotificationState>({ show: false });

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
      });

      action$.errors().once(error => {
        setIsDeleting(false);
        setNotification({ show: true, message: error.message, variant: 'failure' });
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
              location: t('in-synthetics:dashboard.locationList.location')
            })}
            <Input
              name="typingValidation"
              placeholder={t('in-synthetics:dashboard.locationList.location')}
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
            disabled={validationInputValue !== 'LOCATION' || isBlank(reasonInputValue)}
            kind="danger"
          >
            {t('in-synthetics:dashboard.locationList.deleteLocationLabel')}
          </Button>
        </section>
      </Dialog>
    );
  }

  return (
    <HorizontalFlexWrapper className={locals.actions}>
      <MoreMenu
        renderInteractiveElement={({ ref, toggle }: InteractiveElementsProps) => (
          <IconButton
            kind="info"
            type="lib_menu_more_horizontal"
            onClick={e => {
              stopPropagation(e);
              toggle();
            }}
            ref={ref as React.MutableRefObject<HTMLButtonElement>}
          />
        )}
      >
        <MoreMenuButton icon="lib_actions_delete" onClick={showDeleteDialog}>
          {t('in-synthetics:dashboard.locationList.deleteLocation')}
        </MoreMenuButton>
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
}
