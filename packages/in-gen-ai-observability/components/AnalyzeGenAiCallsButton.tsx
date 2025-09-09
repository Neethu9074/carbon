/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/components';

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { t } from 'in-i18n';

const GEN_AI_TAG_FILTER = tagFilter('technology', EQUALS, 'genai', null, DESTINATION);

export default function AnalyzeGenAiCallsButton() {
  const getLinkToAnalyze = useLinkToAnalyze();

  return (
    <Button
      kind="action"
      size="compact"
      icon="lib_application_call"
      href={getLinkToAnalyze({
        dataSource: 'calls',
        formModel: [GEN_AI_TAG_FILTER]
      })}
    >
      {t('in-gen-ai-observability:mainDashboard.analyzeGenAICalls')}
    </Button>
  );
}
