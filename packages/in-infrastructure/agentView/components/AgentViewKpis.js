/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import TwoValueBar from 'in-new-components/TwoValueBar';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

import locals from './AgentViewKpis.mless';

export default function AgentViewKpis({ agentSnapshots }) {
  return (
    <div className={locals.row}>
      <KpiCard
        title={t('in-infrastructure:agentView.totalAgents')}
        value={
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
        }
      />
    </div>
  );
}
