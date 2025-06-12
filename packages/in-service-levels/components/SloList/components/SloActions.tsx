/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, OverflowMenu, OverflowMenuItem } from '@instana/carbon';
import { SvgIcon } from '@instana/components';

import useDoDeleteSloConfiguration from 'in-service-levels/hooks/useDoDeleteSloConfiguration';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { SloListItem } from 'in-service-levels/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from 'in-service-levels/styles/SloAlignContent.mless';

const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };

interface SloActionProps {
  item: SloListItem;
}

export default function SloActions({ item }: SloActionProps) {
  const { configuration, entities } = item;
  const disabled = entities.some(({ deleted }) => deleted);
  const openCloneDialog = () => {
    addActiveDialog(
      <ConfigureSloDialog
        mode="CLONE"
        configuration={{
          ...configuration,
          id: undefined,
          lastUpdated: undefined,
          name: t('in-service-levels:general.nameCopyTemplate', { name: item.configuration.name })
        }}
        trackingMeta={meta}
      />
    );
  };

  const openEditDialog = () => {
    addActiveDialog(<ConfigureSloDialog mode="EDIT" configuration={configuration} trackingMeta={meta} />);
  };

  const doDelete = useDoDeleteSloConfiguration(configuration, meta);

  return (
    <Stack className={locals.stackAlignEnd}>
      <OverflowMenu kind="subtle" flipped>
        <OverflowMenuItem
          itemText={
            <div className={locals.overflowMenuItemContainer}>
              <SvgIcon size="s" type={'lib_actions_edit'} />
              {t('in-service-levels:general.editButtonLabel')}
            </div>
          }
          disabled={disabled}
          onClick={disabled ? noop : openEditDialog}
        />

        <OverflowMenuItem
          onClick={openCloneDialog}
          itemText={
            <div className={locals.overflowMenuItemContainer}>
              <SvgIcon size="s" type={'lib_actions_copy'} />
              {t('in-service-levels:general.copyButtonLabel')}
            </div>
          }
        />

        <OverflowMenuItem
          isDelete
          onClick={() => {
            doDelete();
          }}
          itemText={
            <div className={locals.overflowMenuItemContainer}>
              <SvgIcon size="s" type={'lib_actions_delete'} />
              {t('in-service-levels:general.deleteButtonLabel')}
            </div>
          }
        />
      </OverflowMenu>
    </Stack>
  );
}
