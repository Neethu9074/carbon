/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { IconButton } from '@instana/components';

import EditConfigurationDialog from 'in-infrastructure/CollectorsView/Dashboard/EditConfigurationDialog';
import { SnapshotItem } from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboard';
import { restartOtelCollector } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './ActionsButtonSection.mless';

export default function ActionsButtonSection({ snapshot }: { snapshot: SnapshotItem }) {
  return (
    <div className={locals.actionButtonsContainer}>
      <IconButton
        type="lib_actions_refresh"
        size="compact"
        onClick={() => {
          restartOtelCollector(snapshot);
        }}
        isWrapperedByTooltip
        iconDescription={t('in-infrastructure:collectorView.restartCollector')}
      />
      <IconButton
        type="lib_actions_settings_edit"
        size="compact"
        onClick={() => addActiveDialog(<EditConfigurationDialog />)}
        isWrapperedByTooltip
        iconDescription={t('in-infrastructure:collectorView.editConfiguration')}
      />
    </div>
  );
}
