/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import useDoDeleteSloConfiguration from 'in-service-levels/hooks/useDoDeleteSloConfiguration';
import CreateSloDialog from 'in-service-levels/components/ConfigDialog/CreateSloDialog';
import { serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import IconButton from 'in-components/IconButton/IconButton';

interface SloActionButtonsProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function SloActionButtons({ configuration }: SloActionButtonsProps) {
  const { goToPath } = useNavigation();
  const doDelete = useDoDeleteSloConfiguration(configuration, success => success && goToPath(serviceLevelsOverview));
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
      />
    );
  };

  const openEditDialog = () => {
    addActiveDialog(<CreateSloDialog mode="EDIT" configuration={configuration} />);
  };

  return (
    <Stack align="end" direction="horizontal" gap="disabled">
      <IconButton type="lib_actions_edit" buttonType="button" kind="primary" onClick={openEditDialog} />
      <IconButton type="lib_actions_copy" buttonType="button" kind="primary" onClick={openCloneDialog} />
      <IconButton type="lib_actions_delete" buttonType="button" kind="primary" onClick={doDelete} />
    </Stack>
  );
}
