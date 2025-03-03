/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import DeleteSloMoreMenuButton from 'in-service-levels/components/SloList/components/DeleteSloMoreMenuButton';
import CreateSloDialog from 'in-service-levels/components/ConfigDialog/CreateSloDialog';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface Props {
  item: SloListItem;
}

export default function SloActions({ item }: Props) {
  const { configuration, entities } = item;
  const disabled = entities.some(({ deleted }) => deleted);
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };
  const openCloneDialog = () => {
    addActiveDialog(
      <CreateSloDialog
        mode="CLONE"
        configuration={{
          ...configuration,
          id: undefined,
          lastUpdated: undefined,
          name: t('in-service-levels:createSloDialog.sloNameCopyTemplate', { name: item.configuration.name })
        }}
        trackingMeta={meta}
      />
    );
  };

  const openEditDialog = () => {
    addActiveDialog(<CreateSloDialog mode="EDIT" configuration={configuration} trackingMeta={meta} />);
  };

  return (
    <Stack align="end">
      <MoreMenu kind="subtle">
        <MoreMenuButton icon="lib_actions_edit" disabled={disabled} onClick={disabled ? noop : openEditDialog}>
          {t('in-service-levels:general.editButtonLabel')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_copy" onClick={openCloneDialog}>
          {t('in-service-levels:general.copyButtonLabel')}
        </MoreMenuButton>
        <DeleteSloMoreMenuButton configuration={item.configuration} />
      </MoreMenu>
    </Stack>
  );
}
