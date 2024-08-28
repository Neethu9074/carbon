/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { emptyList } from 'in-services/fixedImmutables';
import TwoValueBar from 'in-components/TwoValueBar';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

import locals from './AgentViewKpis.mless';

export default function AgentViewKpis({ agentSnapshotsResult }) {
  if (!agentSnapshotsResult || agentSnapshotsResult.getIn(['progress', 'loading'])) {
    return <LoadingIndicator type="dark" />;
  }
  if (agentSnapshotsResult.getIn(['errors']).length > 0) {
    return (
      <ErroneousResultPresenter
        errors={[{ message: t('in-infrastructure:agentView.anErrorOccurredPleaseTryAgain') }]}
      />
    );
  }
  const agentSnapshots = agentSnapshotsResult.getIn(['data']);

  return (
    <div className={locals.row}>
      <KpiCard title={t('in-infrastructure:agentView.totalAgents')}>
        <div className={locals.value}>
          {`${agentSnapshots?.get('online', emptyList).size + agentSnapshots?.get('offline', emptyList).size || 0}`}
          <div className={locals.twoValueBar}>
            <TwoValueBar
              v1={agentSnapshots?.get('online', emptyList).size}
              v2={agentSnapshots?.get('offline', emptyList).size}
              formatter={v => v}
              v1Label={t('in-infrastructure:agentView.reporting')}
              v2Label={t('in-infrastructure:agentView.notReporting')}
            />
          </div>
        </div>
      </KpiCard>
    </div>
  );
}
