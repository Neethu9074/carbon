/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { LocationListItem } from '@instana/types';
import { Link } from '@instana/legacy';

// @ts-expect-error Could not find a declaration file
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { showDeleteSuccessMessage, showDeleteErrorMessage } from 'in-synthetics/components/utils/userFeedback';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import IconButton from 'in-components/IconButton/IconButton';
import { stopPropagation } from 'in-services/util/function';
import { deleteLocation } from 'in-synthetics/api';
import { t, Trans } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

const context: string = 'locations';

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

  function deleteSelectedLocation(locationId: string) {
    addActiveDialog(
      <ConfirmationDialog
        header={t('in-synthetics:dashboard.testList.labelConfirm')}
        description={
          <span>
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
          </span>
        }
        confirmButtonLabel={t('in-synthetics:dashboard.testList.labelRemove')}
        onSubmit={() => {
          close();
          deleteLocation(locationId).once(
            () => {
              showDeleteSuccessMessage(context);
            },
            () => {
              showDeleteErrorMessage(context);
            }
          );
        }}
      />
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
        <MoreMenuButton icon="lib_actions_delete" onClick={() => deleteSelectedLocation(id)}>
          {t('in-synthetics:dashboard.locationList.deleteLocation')}
        </MoreMenuButton>
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
}
