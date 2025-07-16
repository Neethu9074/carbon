/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import { isEmpty, isNull } from 'lodash';

import { Stack } from '@instana/carbon';

import RootCauseBarChart from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/RootCauseBarChart';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { Explainability } from 'in-events/components/RootCauseAnalysis/utils/types';

const getExplainabilityPercents = (explainabilityMetadata: Explainability[]) => {
  if (isEmpty(explainabilityMetadata) || isNull(explainabilityMetadata)) return { throughRC: null, notThroughRC: null };
  const aggregatedInfo = explainabilityMetadata.find(e => e.connectedServiceId === 'all');

  const throughDecimal = aggregatedInfo?.percentageFailedThroughRC ?? null;
  const notThroughDecimal = aggregatedInfo?.percentageFailedNotThroughRC ?? null;

  const throughRC = typeof throughDecimal === 'number' ? throughDecimal * 100 : throughDecimal;
  const notThroughRC = typeof notThroughDecimal === 'number' ? notThroughDecimal * 100 : notThroughDecimal;

  return {
    throughRC,
    notThroughRC
  };
};

export default function EvidenceSection() {
  const { selectedEntityId } = useEntitySelection();
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const rootCauseIndex = rootCauses.findIndex(rc => rc.entityData?.id === selectedEntityId);
  const rootCause = rootCauseMetadata[rootCauseIndex] ?? null;

  // Extract the error rate percentages
  const { throughRC, notThroughRC } = getExplainabilityPercents(rootCause?.explainability);

  return (
    <Stack orientation="vertical" gap={5}>
      <RootCauseBarChart throughRCValue={throughRC} notThroughRCValue={notThroughRC} />
    </Stack>
  );
}
