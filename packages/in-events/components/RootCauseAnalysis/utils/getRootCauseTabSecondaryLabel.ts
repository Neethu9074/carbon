/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from '@instana/i18n-react';

import { ProbableCauseType } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';

const getRootCauseTabSecondaryLabel = (rootCause: ProbableCauseType) => {
  if (!rootCause) return '';
  const probFailureValue = rootCause.get('probFailure') as number;
  let probText: string | undefined = undefined;
  if (probFailureValue >= 0.7) {
    probText = t('in-events:RCA.highProbabilitySecondaryLabel');
  } else if (probFailureValue >= 0.35) {
    probText = t('in-events:RCA.moderateProbabilitySecondaryLabel');
  } else {
    probText = t('in-events:RCA.lowProbabilitySecondaryLevel');
  }
  return probText;
};

export default getRootCauseTabSecondaryLabel;
