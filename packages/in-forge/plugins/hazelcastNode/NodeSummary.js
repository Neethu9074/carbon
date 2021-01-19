/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { yesOrNo } from 'in-services/formatters/boolean';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';

export default function NodeSummary({ snapshot }) {
  return (
    <KpiSection>
      <KpiKeyValue label="Is Local Member Safe">{yesOrNo(snapshot.getIn(['data', 'isLocalMemberSafe']))}</KpiKeyValue>
    </KpiSection>
  );
}
