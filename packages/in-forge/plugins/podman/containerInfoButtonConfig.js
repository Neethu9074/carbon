/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ContainerInfoDialog from 'in-forge/plugins/podman/ContainerInfoDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { isEntityOnline } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default {
  label: t('in-forge:plugins.podman.getContainerInfo'),
  icon: 'lib_help_error_info_outline',
  getTooltip: ({ isOnline }) =>
    isOnline
      ? t('in-forge:plugins.podman.containerInfoIsAlwaysLive')
      : t('in-forge:plugins.podman.containerInfoCanOnlyBeRetrievedForEntitiesThatAreStillUnderMonitoringByInstana'),
  onClick: ({ isOnline, snapshot }) => {
    if (isOnline) {
      addActiveDialog(<ContainerInfoDialog snapshot={snapshot} time={Date.now()} />);
    }
  },
  isDisabled: ({ isOnline }) => !isOnline,
  getObservables: ({ snapshotId }) => ({ isOnline: isEntityOnline(snapshotId) })
};
