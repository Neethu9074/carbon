/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Stack, IconButton } from '@instana/components';

import useDoDeleteSloConfiguration from 'in-service-levels/hooks/useDoDeleteSloConfiguration';
import CreateSloDialog from 'in-service-levels/components/ConfigDialog/CreateSloDialog';
import { serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface SloActionButtonsProps {
  configuration: ServiceLevelObjectiveConfiguration;
  editDisabled: boolean | undefined;
}

export default function SloActionButtons({ configuration, editDisabled }: SloActionButtonsProps) {
  const { goToPath } = useNavigation();
  const meta = { productArea: productAreas.slo, pageName: pageNames.slo_config };
  const doDelete = useDoDeleteSloConfiguration(
    configuration,
    meta,
    success => success && goToPath(serviceLevelsOverview)
  );

  const openCloneDialog = () => {
    addActiveDialog(
      <CreateSloDialog
        mode="CLONE"
        configuration={{
          ...configuration,
          id: undefined,
          lastUpdated: undefined,
          name: t('in-service-levels:createSloDialog.sloNameCopyTemplate', { name: configuration.name })
        }}
        trackingMeta={meta}
      />
    );
  };

  const openEditDialog = () => {
    addActiveDialog(<CreateSloDialog mode="EDIT" configuration={configuration} trackingMeta={meta} />);
  };

  return (
    <Stack align="end" direction="horizontal" gap="disabled">
      <IconButton
        type="lib_actions_edit"
        buttonType="button"
        kind="primary"
        onClick={editDisabled ? noop : openEditDialog}
        disabled={editDisabled}
      />
      <IconButton type="lib_actions_copy" buttonType="button" kind="primary" onClick={openCloneDialog} />
      <IconButton type="lib_actions_delete" buttonType="button" kind="primary" onClick={doDelete} />
    </Stack>
  );
}
