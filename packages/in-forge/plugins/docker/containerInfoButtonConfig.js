/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ContainerInfoDialog from 'in-forge/plugins/docker/ContainerInfoDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { isEntityOnline } from 'in-stores/snapshot';

export default {
  label: 'Get Container Info',
  icon: 'lib_help_error_info_outline',
  getTooltip: ({ isOnline }) =>
    isOnline
      ? 'Container info is always live.'
      : 'Container info can only be retrieved for entities that are still under monitoring by Instana.',
  onClick: ({ isOnline, snapshot }) => {
    if (isOnline) {
      addActiveDialog(<ContainerInfoDialog snapshot={snapshot} time={Date.now()} />);
    }
  },
  isDisabled: ({ isOnline }) => !isOnline,
  getObservables: ({ snapshotId }) => ({ isOnline: isEntityOnline(snapshotId) })
};
