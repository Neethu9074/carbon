/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { clickBizopsProcessAnalyzeInstancesTracker } from 'in-bizops/tracker';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { t } from 'in-i18n';

/* This component directs the user to the Analyze page, with filters set
to the specific Business Process they are currently in*/
interface AnalyzeButtonProps {
  businessProcessId: string;
  businessProcessName: string;
  businessActivityName: string;
}
export default function AnalyzeButton({
  businessProcessId,
  businessProcessName,
  businessActivityName
}: AnalyzeButtonProps) {
  const getLinkToAnalyze = useLinkToAnalyze();
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href={getLinkToAnalyze({
        formModel: [
          tagFilter('call.bpm.process.definition.name', EQUALS, businessProcessName),
          { type: 'CONJUNCTION', logicalOperator: 'AND' },
          { type: 'OPEN_BRACKET' },
          tagFilter('call.type', EQUALS, 'BATCH'),
          { type: 'CONJUNCTION', logicalOperator: 'OR' },
          tagFilter('call.type', EQUALS, 'INTERNAL'),
          { type: 'CLOSE_BRACKET' }
        ],
        groupBy: {
          groupbyTag: 'call.bpm.root.process.instance.id'
        },
        hiddenCalls: {
          includeInternal: true,
          includeSynthetic: false
        },
        fastQueryModeEnabled: true
      })}
      onClick={() => {
        clickBizopsProcessAnalyzeInstancesTracker({
          processId: businessProcessId,
          processName: businessProcessName,
          activityName: businessActivityName
        });
      }}
    >
      {t('in-bizops:dashboards.analyzeInstances')}
    </Button>
  );
}
