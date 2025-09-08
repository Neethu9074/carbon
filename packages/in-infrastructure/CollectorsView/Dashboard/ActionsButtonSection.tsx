/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { IconButton } from '@instana/components';
import { InlineLoading } from '@instana/carbon';

import {
  OTEL_COLLECTOR_RESTART_CLICKED,
  OTEL_COLLECTOR_EDIT_CONFIGURATION_CLICKED
} from 'in-services/tracking/tracking';
import { loadRawAgentConfigurationOtel, restartOtelCollector } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import EditConfigurationTearsheet from 'in-infrastructure/CollectorsView/Dashboard/EditConfigurationTearsheet';
import { SnapshotItem } from 'in-infrastructure/CollectorsView/Dashboard/CollectorDashboard';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './ActionsButtonSection.mless';

export default function ActionsButtonSection({ snapshot }: { snapshot: SnapshotItem }) {
  const { trackCta } = useSegmentTracking();
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className={locals.actionButtonsContainer}>
      <IconButton
        type="lib_actions_refresh"
        size="compact"
        onClick={() => {
          trackCta(OTEL_COLLECTOR_RESTART_CLICKED);
          restartOtelCollector(snapshot);
        }}
        isWrapperedByTooltip
        iconDescription={t('in-infrastructure:collectorView.restartCollector')}
      />
      {showLoading ? (
        <InlineLoading />
      ) : (
        <IconButton
          type="lib_actions_settings_edit"
          size="compact"
          onClick={() => {
            trackCta(OTEL_COLLECTOR_EDIT_CONFIGURATION_CLICKED);
            setShowLoading(true);
            // Load the configuration and wait for it to complete before opening the dialog
            loadRawAgentConfigurationOtel(snapshot, setShowLoading).once(response => {
              if (response && !response.error) {
                setShowLoading(false);
                addActiveDialog(<EditConfigurationTearsheet snapshot={snapshot} />);
              }
              // error handling is in the loadRawAgentConfigurationOtel function
            });
          }}
          isWrapperedByTooltip
          iconDescription={t('in-infrastructure:collectorView.editConfiguration')}
        />
      )}
    </div>
  );
}
