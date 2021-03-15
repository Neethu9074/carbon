/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function NodeSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiKeyValue label={t('in-forge:plugins.hazelcastNode.isLocalMemberSafe')}>
        {yesOrNo(snapshot.getIn(['data', 'isLocalMemberSafe']))}
      </KpiKeyValue>
    </KpiSection>
  );
}
