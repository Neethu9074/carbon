/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/carbon';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { RenderIcon } from 'in-components/SaveFilters/RenderIcon';
import { t } from 'in-i18n';

interface AnalyzeSubtracesButtonProps {
  subtraceId: string;
  subtraceName: string;
}
export default function AnalyzeSubtracesButton({ subtraceId, subtraceName }: AnalyzeSubtracesButtonProps) {
  const { goToPath } = useNavigation();
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const linkToSubtraceAnalyze = getLinkToApplicationAnalyze({
    subtraceId,
    subtraceName,
    dataSource: 'subtraces'
  });
  return (
    <Button
      kind="primary"
      iconDescription={t('in-applications:buttonAnalyzeSubtraces')}
      renderIcon={() => <RenderIcon size="xs" type="lib_application_call" />}
      size="sm"
      onClick={() => goToPath(linkToSubtraceAnalyze.slice(2))}
    >
      {t('in-applications:buttonAnalyzeSubtraces')}
    </Button>
  );
}
