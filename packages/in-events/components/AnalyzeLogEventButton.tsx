/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { LogAlertConfig, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  alertConfig: LogAlertConfig;
  timeConfig: TimeConfig;
}

export default function AnalyzeLogEventButton({ alertConfig, timeConfig }: Props) {
  const { tagFilterExpression } = alertConfig;

  const logsHref = useLinkToLogs({
    tagFilterExpression: fromBackendModel(tagFilterExpression),
    timeConfig
  });

  return (
    <Button kind="primary" icon="lib_analyze_inverted" href={logsHref}>
      {t('in-analyze:logDetails.analyzeLogsLabel')}
    </Button>
  );
}
