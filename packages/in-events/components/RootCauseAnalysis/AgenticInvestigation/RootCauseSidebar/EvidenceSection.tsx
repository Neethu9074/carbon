/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import { isEmpty, isNull } from 'lodash';

import { Typography } from '@instana/components';

import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { Explainability } from 'in-events/components/RootCauseAnalysis/utils/types';
import { t } from 'in-i18n';

import locals from './EvidenceSection.mless';

const getExplainabilityPercents = (explainabilityMetadata: Explainability[]) => {
  if (isEmpty(explainabilityMetadata) || isNull(explainabilityMetadata))
    return { throughRC: 'N/A', notThroughRC: 'N/A' };
  const aggregatedInfo = explainabilityMetadata.find(e => e.connectedServiceId === 'all');

  const throughDecimal = aggregatedInfo?.percentageFailedThroughRC ?? 'N/A';
  const notThroughDecimal = aggregatedInfo?.percentageFailedNotThroughRC ?? 'N/A';

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
  const entityName = rootCauses[rootCauseIndex]?.entityData?.label;

  // Extract the error rate percentages
  const { throughRC, notThroughRC } = getExplainabilityPercents(rootCause?.explainability);

  return (
    <div className={locals.evidenceContainer}>
      <div>
        <Typography variant="body-bold">{t('in-events:RCA.erroneousCalls')}</Typography>
      </div>
      <div className={locals.evidenceColumns}>
        <div className={locals.evidenceColumn}>
          <div className={locals.percentValue}>
            <Typography variant="heading-compact-02">{throughRC}%</Typography>
          </div>
          <div>
            <Typography variant="body-compact-01">
              {t('in-events:RCA.throughEntity', {
                entityName
              })}
            </Typography>
          </div>
        </div>
        <div className={locals.evidenceColumn}>
          <div className={locals.percentValue}>
            <Typography variant="heading-compact-02">{notThroughRC}%</Typography>
          </div>
          <div>
            <Typography variant="body-compact-01">
              {t('in-events:RCA.notThroughEntity', {
                entityName
              })}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
