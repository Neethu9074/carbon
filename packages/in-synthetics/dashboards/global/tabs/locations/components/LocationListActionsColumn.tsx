/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useState } from 'react';

import { LocationListItem } from '@instana/types';
import { IconButton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import DeactivateSelectedLocation from 'in-synthetics/dashboards/global/tabs/locations/components/DeactivateSelectedLocation';
import ActivateSelectedLocation from 'in-synthetics/dashboards/global/tabs/locations/components/ActivateSelectedLocation';
// @ts-expect-error Could not find a declaration file
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { DatacenterResponse, dummyResultSynDatacenter, dummySyntheticDatacenter } from 'in-synthetics/utils/constants';
import DeleteSelectedLocation from 'in-synthetics/dashboards/global/tabs/locations/components/DeleteSelectedLocation';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import { stopPropagation } from 'in-services/util/function';
import { getDatacenter } from 'in-synthetics/api';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/LocationListActionsColumn.mless';

interface LocationListActionsColumnProps {
  item: LocationListItem;
  isLoading: boolean;
}

const LocationListActionsColumn = ({ item, isLoading }: LocationListActionsColumnProps) => {
  const datacenterResponse: DatacenterResponse =
    useObservable<any, []>(() => getDatacenter(item.label), []) || dummyResultSynDatacenter;
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);
  const isDeleteEnable = item.type === 'Private' || (item.type === 'Managed' && item.status === 'Offline');
  const isDeactiveEnable = item.type === 'Managed' && (item.status === 'Online' || item.status === 'Unlicensed');
  const isActivateEnable = item.type === 'Managed' && item.status === 'Offline';

  useEffect(() => {
    if (!isLoading && isMoreMenuSaving) {
      setIsMoreMenuSaving(false);
    }
    // We only want to fire the hook when isLoading changes to ensure that we
    // reset the loading spinner when the new entities are loaded from backend
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const showDeleteDialog = () => {
    return addActiveDialog(<DeleteSelectedLocation item={item} />);
  };

  const showDeactivateDialog = () => {
    return addActiveDialog(<DeactivateSelectedLocation item={item} />);
  };

  const showActivateDialog = () => {
    return addActiveDialog(
      <ActivateSelectedLocation datacenter={datacenterResponse?.data || dummySyntheticDatacenter} onClose={close} />
    );
  };

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
        {isActivateEnable && (
          <MoreMenuButton
            icon="lib_actions_unlock"
            onClick={showActivateDialog}
            requireTitle
            title={t('in-synthetics:dashboard.locationList.activate')}
          >
            {t('in-synthetics:dashboard.locationList.activate')}
          </MoreMenuButton>
        )}
        {isDeleteEnable && (
          <MoreMenuButton
            icon="lib_actions_delete"
            onClick={showDeleteDialog}
            requireTitle
            title={t('in-synthetics:dashboard.locationList.deleteLocation')}
          >
            {t('in-synthetics:dashboard.locationList.deleteLocation')}
          </MoreMenuButton>
        )}
        {isDeactiveEnable && (
          <MoreMenuButton
            icon="lib_actions_lock"
            onClick={showDeactivateDialog}
            requireTitle
            title={t('in-synthetics:dashboard.locationList.deactivateLocation.deactivate')}
          >
            {t('in-synthetics:dashboard.locationList.deactivateLocation.deactivate')}
          </MoreMenuButton>
        )}
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
};

export default LocationListActionsColumn;
