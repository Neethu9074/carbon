/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { t } from 'in-i18n';

/* This component directs the user to the Analyze page, with filters set
to the specific Business Process they are currently in*/
interface AnalyzeButtonProps {
  businessProcessName: string;
}
export default function AnalyzeButton({ businessProcessName }: AnalyzeButtonProps) {
  const getLinkToAnalyze = useLinkToAnalyze();
  return (
    <Button
      kind="primary"
      icon="lib_application_call"
      href={getLinkToAnalyze({
        formModel: [tagFilter('call.bpm.process.definition.name', EQUALS, businessProcessName)],
        groupBy: {
          groupbyTag: 'call.bpm.root.process.instance.id'
        }
      })}
    >
      {t('in-bizops:dashboards.analyzeInstances')}
    </Button>
  );
}
