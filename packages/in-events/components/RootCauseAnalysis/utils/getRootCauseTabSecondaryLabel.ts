/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get, isEmpty, isNull } from 'lodash';

import { t } from '@instana/i18n-react';

import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';

const getRootCauseTabSecondaryLabel = (rootCause: RootCause) => {
  if (isNull(rootCause) || isEmpty(rootCause)) return '';

  const probFailureValue = get(rootCause, 'probFailure', 0);
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
