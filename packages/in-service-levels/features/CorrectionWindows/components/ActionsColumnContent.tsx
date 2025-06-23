/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack, OverflowMenu, OverflowMenuItem } from '@instana/carbon';
import { CorrectionConfiguration } from '@instana/types';
import { SvgIcon } from '@instana/components';

import ConfigureCorrectionWindowDialog from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/ConfigureCorrectionWindowDialog';
import useDoDeleteCorrectionWindow from 'in-service-levels/features/CorrectionWindows/hooks/useDoDeleteCorrectionConfiguration';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

import locals from 'in-service-levels/styles/SloAlignContent.mless';

const meta = { productArea: productAreas.slo, pageName: pageNames.correction_windows };

interface SloActionProps {
  item: CorrectionConfiguration;
}

export default function SloActions({ item }: SloActionProps) {
  const doDeleteCorrectionWindow = useDoDeleteCorrectionWindow(item, meta);
  const openEditDialog = () => {
    addActiveDialog(<ConfigureCorrectionWindowDialog mode="EDIT" configuration={item} trackingMeta={meta} />);
  };
  const openCloneDialog = () => {
    addActiveDialog(
      <ConfigureCorrectionWindowDialog
        mode="CLONE"
        configuration={{
          ...item,
          name: t('in-service-levels:general.nameCopyTemplate', { name: item.name })
        }}
        trackingMeta={meta}
      />
    );
  };
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
          onClick={openEditDialog}
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
          onClick={doDeleteCorrectionWindow}
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
