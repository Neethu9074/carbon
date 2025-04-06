/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { t } from '@instana/i18n-react';

const getRootCauseTabLabel = (rootCauseIndex: number) => {
  return rootCauseIndex === 0 ? t('in-events:RCA.mostLikelyCause') : t('in-events:RCA.probableCause');
};

export default getRootCauseTabLabel;
