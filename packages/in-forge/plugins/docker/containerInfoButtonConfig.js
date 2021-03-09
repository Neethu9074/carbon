/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ContainerInfoDialog from 'in-forge/plugins/docker/ContainerInfoDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { isEntityOnline } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default {
  label: t('in-forge:plugins.docker.getContainerInfo'),
  icon: 'lib_help_error_info_outline',
  getTooltip: ({ isOnline }) =>
    isOnline
      ? t('in-forge:plugins.docker.containerInfoIsAlwaysLive')
      : t('in-forge:plugins.docker.containerInfoCanOnlyBeRetrievedForEntitiesThatAreStillUnderMonitoringByInstana'),
  onClick: ({ isOnline, snapshot }) => {
    if (isOnline) {
      addActiveDialog(<ContainerInfoDialog snapshot={snapshot} time={Date.now()} />);
    }
  },
  isDisabled: ({ isOnline }) => !isOnline,
  getObservables: ({ snapshotId }) => ({ isOnline: isEntityOnline(snapshotId) })
};
