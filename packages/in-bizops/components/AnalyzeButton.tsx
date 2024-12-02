/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useLinkToAnalyze } from 'in-applications/navigation/paths';
import { bizopsAnalyzeInstancesClick } from 'in-bizops/tracker';
import { t } from 'in-i18n';

/* This component directs the user to the Analyze page, with filters set
to the specific Business Process they are currently in.  Filters also
include the activity name if not empty */
interface AnalyzeButtonProps {
  businessProcessId: string;
  businessProcessName: string;
  businessActivityName?: string;
}
export default function AnalyzeButton({
  businessProcessId,
  businessProcessName,
  businessActivityName
}: AnalyzeButtonProps) {
  // We use the applications analytics implementation since there is no point
  // duplicating code.
  const getLinkToAnalyze = useLinkToAnalyze();
  const { location } = useNavigation();
  return (
    <Button
      kind="action"
      icon="lib_application_call"
      size="compact"
      href={getLinkToAnalyze({
        formModel: formModelBuilder(businessProcessId, businessActivityName),
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
        bizopsAnalyzeInstancesClick({
          path: location.pathname,
          processId: businessProcessId,
          processName: businessProcessName,
          activityName: businessActivityName || undefined
        });
      }}
    >
      {t('in-bizops:dashboards.analyzeInstances')}
    </Button>
  );
}

function formModelBuilder(businessProcessId: string, businessActivityName?: string) {
  let formModel: FormModelElement[] = [tagFilter('call.bpm.process.definition.id', EQUALS, businessProcessId)];

  // For when the user clicks on analyze instances in
  // the individual activity page
  if (businessActivityName) {
    formModel.push(
      { type: 'CONJUNCTION', logicalOperator: 'AND' },
      tagFilter('call.bpm.activity.name', EQUALS, businessActivityName)
    );
  }

  formModel.push(
    { type: 'CONJUNCTION', logicalOperator: 'AND' },
    { type: 'OPEN_BRACKET' },
    tagFilter('call.type', EQUALS, 'BATCH'),
    { type: 'CONJUNCTION', logicalOperator: 'OR' },
    tagFilter('call.type', EQUALS, 'INTERNAL'),
    { type: 'CLOSE_BRACKET' }
  );

  return formModel;
}
