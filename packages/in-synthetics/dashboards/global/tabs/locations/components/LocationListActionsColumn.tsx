/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { LocationListItem } from '@instana/types';

import DeactivateSelectedLocation from 'in-synthetics/dashboards/global/tabs/locations/components/DeactivateSelectedLocation';
// @ts-expect-error Could not find a declaration file
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import DeleteSelectedLocation from 'in-synthetics/dashboards/global/tabs/locations/components/DeleteSelectedLocation';
import { showLocationDeactivateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { syntheticDeactivateDatacentersEnabled } from 'in-services/featureFlags';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import IconButton from 'in-components/IconButton/IconButton';
import { stopPropagation } from 'in-services/util/function';
import { deactivateLocation } from 'in-synthetics/api';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/LocationListActionsColumn.mless';

interface LocationListActionsColumnProps {
  item: LocationListItem;
  isLoading: boolean;
}

const LocationListActionsColumn = ({ item, isLoading }: LocationListActionsColumnProps) => {
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);
  const isDeleteEnable = item.type === 'Private' || (item.type === 'Managed' && item.status === 'Offline');

  useEffect(() => {
    if (!isLoading && isMoreMenuSaving) {
      setIsMoreMenuSaving(false);
    }
    // We only want to fire the hook when is loading changes to ensure that we
    // reset the loading spinner when the new entities are loaded from backend
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const showDeleteDialog = () => {
    return addActiveDialog(<DeleteSelectedLocation item={item} />);
  };

  const showDeactivateDialog = () => {
    const action$ = deactivateLocation(item.id);

    action$.once(() => {
      return addActiveDialog(<DeactivateSelectedLocation item={item} />);
    });

    action$.errors().once(error => {
      showLocationDeactivateErrorMessage(error.message.split(':')[2]);
    });
  };

  if (syntheticDeactivateDatacentersEnabled) {
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
          {isDeleteEnable && (
            <MoreMenuButton icon="lib_actions_delete" onClick={showDeleteDialog}>
              {t('in-synthetics:dashboard.locationList.deleteLocation')}
            </MoreMenuButton>
          )}
          {item.type === 'Managed' && item.status === 'Online' && (
            <MoreMenuButton icon="lib_actions_lock" onClick={showDeactivateDialog}>
              {t('in-synthetics:dashboard.locationList.deactivateLocation.deactivate')}
            </MoreMenuButton>
          )}
        </MoreMenu>
      </HorizontalFlexWrapper>
    );
  } else {
    return (
      <HorizontalFlexWrapper className={locals.actions}>
        {item.type === 'Private' && (
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
        )}
        {item.type === 'Managed' && (
          <div>
            <Tooltip content={t('in-synthetics:dashboard.locationList.deleteRestrictedDescription')}>
              <span>{t('in-synthetics:dashboard.locationList.noActionsAllowed')}</span>
            </Tooltip>
          </div>
        )}
      </HorizontalFlexWrapper>
    );
  }
};

export default LocationListActionsColumn;
