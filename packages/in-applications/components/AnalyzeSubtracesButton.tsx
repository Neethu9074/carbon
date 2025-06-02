/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/carbon';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { RenderIcon } from 'in-applications/analyze/components/SaveFilters/RenderIcon';
import { t } from 'in-i18n';

interface AnalyzeSubtracesButtonProps {
  subtraceId: string;
  subtraceName: string;
}
export default function AnalyzeSubtracesButton({ subtraceId, subtraceName }: AnalyzeSubtracesButtonProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Button
      kind="primary"
      iconDescription={t('in-applications:buttonAnalyzeCalls')}
      renderIcon={() => <RenderIcon size="xs" type="lib_application_call" />}
      size="sm"
      href={getLinkToApplicationAnalyze({
        subtraceId,
        subtraceName,
        dataSource: 'subtraces'
      })}
    >
      {t('in-applications:buttonAnalyzeCalls')}
    </Button>
  );
}
